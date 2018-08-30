import {
    BehaviorSubject,
    ConnectableObservable,
    Observable,
    Observer
} from 'rxjs';
import {publishReplay} from 'rxjs/operators';


/**
 * Read a File/Blob and emit the data as ArrayBuffer.
 * If {chunkSize} is provided,
 * the data will be read in chunks and emitted as such.
 *
 * @param file
 * @param options
 */
export function toArrayBuffer(file: File | Blob, options?: ReadOptions): Observable<ArrayBuffer> {
    const source = new Observable<ArrayBuffer>(observer => {
        const cancel = new BehaviorSubject(false);
        truncate(file, observer, cancel, options);
        return () => {
            cancel.next(true);
        };
    });
    const replay = publishReplay() as ReplayOperator;
    return replay(source)
        .refCount();
}


export type ReplayOperator = (source: Observable<ArrayBuffer>) => ConnectableObservable<ArrayBuffer>;

export interface ReadOptions {
    chunkSize?: number;
}


/**
 * Read File as text
 * @param file
 */
export function toString(file: File | Blob): Observable<string> {
    const reader = new FileReader();
    return new Observable(observer => {
        reader.onload = (evt: ProgressEvent) => {
            const {result} = evt.target as any;
            observer.next(result);
            observer.complete();
        };
        reader.onerror = err => {
            observer.error(err);
        };
        reader.readAsText(file);
    });
}

/**
 * Read a File as ArrayBuffer
 * @param file
 */
function readAsAb(file: File | Blob): Promise<ArrayBuffer> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (evt: Event) => {
            const {result} = evt.target as any;
            resolve(result);
        };
        reader.onerror = err => {
            reject(err);
        };
        reader.readAsArrayBuffer(file);
    });
}


async function truncate(
    file: File | Blob,
    observer: Observer<ArrayBuffer>,
    cancel: BehaviorSubject<boolean>,
    options?: ReadOptions
) {
    const size = file.size;
    const {chunkSize}: ReadOptions = {...options};
    const increment = typeof chunkSize === 'number'
        && !Number.isNaN(chunkSize)
        && chunkSize !== 0 ? chunkSize : size;

    let offset = 0;
    while (offset < size && !cancel.value) {
        // Don't increment with more than we need
        const diff = size - offset;
        const sliceEnd = diff > increment ? increment : diff;
        const chunk = file.slice(offset, offset + sliceEnd);

        try {
            const data = await readAsAb(chunk);
            observer.next(data);
        } catch (e) {
            cancel.next(true); // Stop reading chunks
            observer.error(e);
        }

        offset += increment;
    }

    observer.complete();
}
