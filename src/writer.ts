import { zlibSync, strFromU8 } from 'fflate';
import { saveData } from './type';

export class Writer {
    data: ArrayBuffer;
    dataView: DataView;
    offset = 0;

    constructor (initialSize: number) {
        this.data = new ArrayBuffer(initialSize);
        this.dataView = new DataView(this.data);
    }

    checkDataViewSize(sizeOfData: number) {
        if (this.dataView.byteLength < (this.offset + sizeOfData)) {
            var newBuffer = new ArrayBuffer(this.dataView.byteLength + sizeOfData);
            new Uint8Array(newBuffer).set(new Uint8Array(this.data));
            this.data = newBuffer;
            this.dataView = new DataView(this.data);
        }
    }

    generateSaveString() {
        const data = new Uint8Array(this.dataView.buffer, 0, this.offset)
        return btoa(strFromU8(zlibSync(data), true));
    }

    setStaticString(value: string) {
        const stringLength = value.length;
        const encoder = new TextEncoder()
        const encodedString = encoder.encode(value);
        for (var i = 0; i < stringLength; i++)
            this.setUint8(encodedString[i])
    }

    setString(value: string) {
        const stringLength = value.length;
        this.setUint32(stringLength);
        const encoder = new TextEncoder()
        const encodedString = encoder.encode(value);
        for (var i = 0; i < stringLength; i++)
            this.setUint8(encodedString[i])
    }

    setInt8(value: number) {
        this.checkDataViewSize(Int8Array.BYTES_PER_ELEMENT);
        this.dataView.setInt8(this.offset, value);
        this.offset += Int8Array.BYTES_PER_ELEMENT;
        return value;
    }
    setUint8(value: number) {
        this.checkDataViewSize(Uint8Array.BYTES_PER_ELEMENT);
        this.dataView.setUint8(this.offset, value);
        this.offset += Uint8Array.BYTES_PER_ELEMENT;
        return value;
    }

    setInt16(value: number) {
        this.checkDataViewSize(Int16Array.BYTES_PER_ELEMENT);
        this.dataView.setInt16(this.offset, value);
        this.offset += Int16Array.BYTES_PER_ELEMENT;
        return value;
    }
    setUint16(value: number) {
        this.checkDataViewSize(Uint16Array.BYTES_PER_ELEMENT);
        this.dataView.setUint16(this.offset, value);
        this.offset += Uint16Array.BYTES_PER_ELEMENT;
        return value;
    }
    setInt32(value: number) {
        this.checkDataViewSize(Int32Array.BYTES_PER_ELEMENT);
        this.dataView.setInt32(this.offset, value);
        this.offset += Int32Array.BYTES_PER_ELEMENT;
        return value;
    }

    setUint32(value: number) {
        this.checkDataViewSize(Uint32Array.BYTES_PER_ELEMENT);
        this.dataView.setUint32(this.offset, value);
        this.offset += Uint32Array.BYTES_PER_ELEMENT;
        return value;
    }

    setBoolean(value: boolean) {
        return this.setUint8(value ? 1 : 0);
    }

    setFloat64(value: number) {
        this.checkDataViewSize(Float64Array.BYTES_PER_ELEMENT);
        this.dataView.setFloat64(this.offset, value);
        this.offset += Float64Array.BYTES_PER_ELEMENT;
        return value;
    }
    setFixedLengthBuffer(value: Uint8Array) {
        const arraySize = value.length;
        for (var i = 0; i < arraySize; i++)
            this.setUint8(value[i])
    }

    setArray(array: Array<any>, setValue: (writer: Writer, value: any) => void) {
        const arraySize = array.length;
        this.setUint32(arraySize);
        array.forEach((value) => {
            setValue(this, value)
        })
    }

    setSet(set: Set<any>, setValue: (writer: Writer, value: any) => void) {
        const array = Array.from(set);
        const arraySize = array.length;
        this.setUint32(arraySize);
        set.forEach((value) => {
            setValue(this, value)
        })
    }

    setMap(map: Map<any, any>, setKey: (writer: Writer, key: any) => void, setValue: (writer: Writer, value: any) => void) {
        const mapSize = map.size;
        this.setUint32(mapSize);
        map.forEach((value, key) => {
            setKey(this, key);
            setValue(this, value);
        })
        for (var i = 0; i < mapSize; i++) {
        }
    }
}

export function parseSave(save: saveData, initialSize: number): string {
    var writer = new Writer(initialSize);
    writer.setStaticString("melvor");
    writer.setUint32(0);
    const headerSizeLocation = writer.offset;
    writer.setMap(save.header.namespaces,
        (writer, key) => writer.setString(key), 
        (writer, value) => writer.setMap(value,
            (writer, key) => writer.setString(key),
            (writer, value) => writer.setUint16(value)
        )
    );
    writer.setUint32(130);
    writer.setString(save.header.saveName);
    writer.setString(save.header.gameMode);
    writer.setUint16(save.header.skillLevel);
    writer.setFloat64(save.header.gp);
    writer.setBoolean(save.header.activeTraining);
    writer.setString(save.header.activeTrainingName);
    writer.setFloat64(save.header.tickTime);
    writer.setFloat64(save.header.saveTime);
    writer.setSet(save.header.activeNamespaces, (writer, value) => writer.setString(value));
    writer.setBoolean(save.header.mods != undefined)
    if (save.header.mods != undefined) {
        writer.setString(save.header.mods.profileId),
        writer.setString(save.header.mods.profileName),
        writer.setSet(save.header.mods.mods, (writer, value) => writer.setUint32(value))
    }
    writer.dataView.setUint32(headerSizeLocation - 4, writer.offset - headerSizeLocation);
    console.log(writer.offset - headerSizeLocation);
    return writer.generateSaveString();
}