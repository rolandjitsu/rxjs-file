import {
    noop,
    Observable,
    Subject
} from 'rxjs';
import {
    toArrayBuffer,
    toString
} from './file';


const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');
const readAsArrayBufferSpy = jest.spyOn(FileReader.prototype, 'readAsArrayBuffer');


describe('toArrayBuffer()', () => {
    beforeEach(() => {
        readAsArrayBufferSpy.mockClear();
    });
    afterEach(() => {
        readAsArrayBufferSpy.mockClear();
    });

    it('should return an Observable', () => {
        const data = {ping: true};
        const file = createFile(data);
        expect(toArrayBuffer(file)).toBeInstanceOf(Observable);
    });

    it('should convert a File to ArrayBuffer', done => {
        const data = {ping: true};
        const file = createFile(data);

        toArrayBuffer(file)
            .subscribe(chunk => {
                // Verify the integrity of the received chunks
                const jsonStr = abToStr(chunk);
                expect(typeof jsonStr).toBe('string');
                try {
                    const json = JSON.parse(jsonStr);
                    expect(json).toEqual(data);
                    done();
                } catch {
                    done.fail('Blob corrupted');
                }
            });
    });

    it('should read/emit the file data into chunks if {chunkSize} option is provided', done => {
        const data = {ping: true}; // Blob size will be 13 bytes for this data
        const file = createFile(data);

        const chunkSize = 10; // bytes
        const buffer = toArrayBuffer(file, {chunkSize});

        const chunks: ArrayBuffer[] = [];
        buffer.subscribe(chunk => {
            chunks.push(chunk);
        }, noop, async () => {
            expect(chunks.length).toBe(2);
            const [first, second] = chunks;
            expect(first.byteLength).toBe(10);
            expect(second.byteLength).toBe(3);

            // Verify the integrity of the received chunks
            const strParts = chunks.map(chunk => abToStr(chunk));
            const jsonStr = strParts.reduce((acc, str) => acc + str, '');
            expect(typeof jsonStr).toBe('string');

            try {
                const json = JSON.parse(jsonStr);
                expect(json).toEqual(data);
                done();
            } catch {
                done.fail('Blob corrupted');
            }
        });
    });

    it('should behave like a cold Observable', done => {
        const data = {ping: true};
        const file = createFile(data);
        const buffer = toArrayBuffer(file);

        expect(readAsArrayBufferSpy).not.toHaveBeenCalled();

        buffer.subscribe(() => {
            expect(readAsArrayBufferSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should share the same source', done => {
        const data = {ping: true}; // 13 bytes
        const file = createFile(data);
        const buffer = toArrayBuffer(file, {
            chunkSize: 7 // 2 batches
        });

        let count = 0;
        const tick = new Subject<void>();
        const batches: {
            a: ArrayBuffer[];
            b: ArrayBuffer[];
        } = {
            a: [],
            b: []
        };

        tick.subscribe(() => {
            count++;
            if (count === 4) { // 2 subscribers * 2 batches each
                expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(2);

                const a = batches.a.map(chunk => abToStr(chunk))
                    .join('');
                expect(JSON.parse(a)).toEqual(data);

                const b = batches.b.map(chunk => abToStr(chunk))
                    .join('');
                expect(JSON.parse(b)).toEqual(data);

                done();
            }
        });

        buffer.subscribe(chunk => {
            batches.a.push(chunk);
            tick.next();
        });

        buffer.subscribe(chunk => {
            batches.b.push(chunk);
            tick.next();
        });
    });

    it('should replay chunks', done => {
        const data = {ping: true}; // 13 bytes
        const file = createFile(data);
        const buffer = toArrayBuffer(file, {
            chunkSize: 4 // 4 batches
        });

        let count = 0;
        buffer.subscribe(() => {
            count++;
            if (count === 2) {
                const chunks: ArrayBuffer[] = [];
                buffer.subscribe(chunk => {
                    chunks.push(chunk);
                }, noop, () => {
                    expect(chunks).toHaveLength(4);

                    const json = chunks.map(chunk => abToStr(chunk))
                        .join('');
                    const obj = JSON.parse(json);
                    expect(obj).toEqual(data);

                    done();
                });
            }
        });
    });

    it('should stop reading chunks if unsub', done => {
        const data = {ping: true};
        const file = createFile(data);

        const chunkSize = 2;
        const buffer = toArrayBuffer(file, {chunkSize});
        const stopAfter = 4;

        const chunks: ArrayBuffer[] = [];
        const sub = buffer.subscribe(chunk => {
            chunks.push(chunk);
            if (chunks.length === stopAfter) {
                sub.unsubscribe();
            }
        });

        setTimeout(() => {
            expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(stopAfter);
            expect(chunks.length).toBe(stopAfter);
            done();
        }, 100);
    });

    it('should error if an error occurs while reading the file', done => {
        const data = {ping: true};
        const file = createFile(data);

        // Trigger an error when we start reading the file
        readAsArrayBufferSpy.mockImplementationOnce(function readAsArrayBuffer(this: FileReader) {
            if (typeof this.onerror === 'function') {
                const evt = new ErrorEvent('File read error');
                this.onerror(evt as any);
            }
        });

        const buffer = toArrayBuffer(file);
        buffer.subscribe(noop, () => {
            done();
        });
    });

    it('should stop reading chunks if it errors', done => {
        const data = {ping: true};
        const file = createFile(data);

        const chunkSize = 2;
        const buffer = toArrayBuffer(file, {chunkSize});
        const chunks: ArrayBuffer[] = [];

        readAsArrayBufferSpy.mockImplementationOnce(function readAsArrayBuffer(this: FileReader) {
            if (typeof this.onerror === 'function') {
                const evt = new ErrorEvent('File read error');
                this.onerror(evt as any);
            }
        });

        buffer.subscribe(chunk => {
            chunks.push(chunk);
        }, () => {
            setTimeout(() => {
                expect(readAsArrayBufferSpy).toHaveBeenCalledTimes(1);
                expect(chunks.length).toBe(0);
                done();
            }, 100);
        });
    });

    it('should complete when done', done => {
        const data = {ping: true};
        const file = createFile(data);

        toArrayBuffer(file)
            .subscribe({
                complete: () => {
                    done();
                }
            });
    });
});

describe('toString()', () => {
    beforeEach(() => {
        readAsTextSpy.mockClear();
    });
    afterEach(() => {
        readAsTextSpy.mockClear();
    });

    it('should return an Observable', () => {
        const data = {ping: true};
        const file = createFile(data);
        expect(toString(file)).toBeInstanceOf(Observable);
    });

    it('should read a File/Blob as text', done => {
        const data = {ping: true};
        const file = createFile(data);

        toString(file)
            .subscribe(str => {
                expect(str).toEqual(JSON.stringify(data));
                done();
            });
    });

    it('should error if an error occurs while reading the file', done => {
        const data = {ping: true};
        const file = createFile(data);

        // Trigger an error when we start reading the file
        readAsTextSpy.mockImplementationOnce(function readAsText(this: FileReader) {
            if (typeof this.onerror === 'function') {
                const evt = new ErrorEvent('File read error');
                this.onerror(evt as any);
            }
        });

        toString(file)
            .subscribe(noop, () => {
                done();
            });
    });
});


function abToStr(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    return String.fromCharCode(...bytes);
}

function createFile(data: object) {
    const json = JSON.stringify(data);
    const blob = new Blob([json], {type: 'application/json'});
    const file = new File([blob], 'test.json');
    return file;
}
