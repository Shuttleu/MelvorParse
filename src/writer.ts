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
    }
    setUint8(value: number) {
        this.checkDataViewSize(Uint8Array.BYTES_PER_ELEMENT);
        this.dataView.setUint8(this.offset, value);
        this.offset += Uint8Array.BYTES_PER_ELEMENT;
    }

    setInt16(value: number) {
        this.checkDataViewSize(Int16Array.BYTES_PER_ELEMENT);
        this.dataView.setInt16(this.offset, value);
        this.offset += Int16Array.BYTES_PER_ELEMENT;
    }
    setUint16(value: number) {
        this.checkDataViewSize(Uint16Array.BYTES_PER_ELEMENT);
        this.dataView.setUint16(this.offset, value);
        this.offset += Uint16Array.BYTES_PER_ELEMENT;
    }
    setInt32(value: number) {
        this.checkDataViewSize(Int32Array.BYTES_PER_ELEMENT);
        this.dataView.setInt32(this.offset, value);
        this.offset += Int32Array.BYTES_PER_ELEMENT;
    }

    setUint32(value: number) {
        this.checkDataViewSize(Uint32Array.BYTES_PER_ELEMENT);
        this.dataView.setUint32(this.offset, value);
        this.offset += Uint32Array.BYTES_PER_ELEMENT;
    }

    setBoolean(value: boolean) {
        this.setUint8(value ? 1 : 0);
    }

    setFloat64(value: number) {
        this.checkDataViewSize(Float64Array.BYTES_PER_ELEMENT);
        this.dataView.setFloat64(this.offset, value);
        this.offset += Float64Array.BYTES_PER_ELEMENT;
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
    }
}

export function parseSave(save: saveData, initialSize: number): string {
    var writer = new Writer(initialSize);
    writer.setStaticString("melvor");
    const headerSizeLocation = writer.offset;
    writer.setUint32(0);
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
    writer.dataView.setUint32(headerSizeLocation, writer.offset - headerSizeLocation - 4);
    const bodySizeLocation = writer.offset;
    writer.setUint32(0);
    writer.setFloat64(save.tickTime);
    writer.setFloat64(save.saveTime);
    writer.setBoolean(save.activeAction != undefined);
    if (save.activeAction != undefined)
        writer.setUint16(save.activeAction);
    writer.setBoolean(save.pausedAction != undefined);
    if (save.pausedAction)
        writer.setUint16(save.pausedAction);
    writer.setBoolean(save.paused);
    writer.setBoolean(save.merchantsPermitRead);
    writer.setUint16(save.gameMode);
    writer.setString(save.characterName);
    writer.setArray(save.bank.lockedItems, (writer, value) => writer.setUint16(value));
    writer.setArray(save.bank.tabs,
        (writer, value) => writer.setMap(value,
            (writer, key) => writer.setUint16(key),
            (writer, value) => writer.setUint32(value)
        )
    );
    writer.setMap(save.bank.defaultTabs,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setUint8(value)
    );
    writer.setArray(save.bank.sortOrder, (writer, value) => writer.setUint16(value));
    writer.setArray(save.bank.glowing, (writer, value) => writer.setUint16(value));
    writer.setMap(save.bank.icons,
        (writer, key) => writer.setUint8(key),
        (writer, value) => writer.setUint16(value)
    );
    writer.setUint32(save.combat.player.character.hp);
    writer.setUint8(save.combat.player.character.nextAction);
    writer.setUint32(save.combat.player.character.attackCount);
    writer.setUint16(save.combat.player.character.nextAttack);
    writer.setBoolean(save.combat.player.character.isAttacking);
    writer.setBoolean(save.combat.player.character.firstHit);
    writer.setUint32(save.combat.player.character.actionTimer.ticksLeft);
    writer.setUint32(save.combat.player.character.actionTimer.maxTicks);
    writer.setBoolean(save.combat.player.character.actionTimer.active);
    writer.setUint32(save.combat.player.character.regenTimer.ticksLeft);
    writer.setUint32(save.combat.player.character.regenTimer.maxTicks);
    writer.setBoolean(save.combat.player.character.regenTimer.active);
    writer.setUint32(save.combat.player.character.turnsTaken);
    writer.setUint32(save.combat.player.character.bufferedRegen);
    writer.setMap(save.combat.player.character.activeEffects,
        (writer, key) => writer.setUint16(key),
        (writer, value) => {
                writer.setBoolean(value.player),
                writer.setUint8(value.type),
                writer.setFloat64(value.damageDealt),
                writer.setFloat64(value.damasetaken),
                writer.setArray(value.parameters, (writer, value) => {writer.setString(value[0]), writer.setUint32(value[1])}),
                writer.setArray(value.statGroups, (writer, value) => {writer.setString(value[0]), writer.setUint32(value[1])}),
                writer.setArray(value.timers, (writer, value) => {
                    writer.setString(value[0]),
                    writer.setUint32(value[1]),
                    writer.setUint32(value[2]),
                    writer.setBoolean(value[3])
            })
        }
    );
    writer.setBoolean(save.combat.player.character.firstMiss);
    writer.setUint32(save.combat.player.character.barrier);
    writer.setBoolean(save.combat.player.meleeType != undefined);
    if (save.combat.player.meleeType != undefined)
        writer.setUint16(save.combat.player.meleeType);
    writer.setBoolean(save.combat.player.rangedType != undefined);
    if (save.combat.player.rangedType != undefined)
        writer.setUint16(save.combat.player.rangedType);
    writer.setBoolean(save.combat.player.magicType != undefined);
    if (save.combat.player.magicType != undefined)
        writer.setUint16(save.combat.player.magicType);
    writer.setUint32(save.combat.player.prayerPoints);
    writer.setUint16(save.combat.player.equipmentSet);
    writer.setArray(save.combat.player.equipmentSets,
        (writer, value) => {
            writer.setArray(value.equipment, (writer, value) => {
                writer.setUint16(value.id);
                writer.setBoolean(value.stackable != undefined)
                if (value.stackable != undefined) {
                    writer.setUint16(value.stackable);
                    writer.setUint32(value.qty);
                }
                writer.setArray(value.quickEquip, (writer, value) => writer.setUint16(value));
            }),
            writer.setBoolean(value.spells.spell != undefined);
            if (value.spells.spell != undefined)
                writer.setUint16(value.spells.spell);
            writer.setBoolean(value.spells.aura != undefined);
            if (value.spells.aura != undefined)
                writer.setUint16(value.spells.aura);
            writer.setBoolean(value.spells.curse != undefined);
            if (value.spells.curse != undefined)
                writer.setUint16(value.spells.curse);
            writer.setArray(value.prayers, (writer, value) => writer.setUint16(value))
    });
    writer.setUint32(save.combat.player.foodSlot);
    writer.setUint32(save.combat.player.maxFoodSlot);
    writer.setArray(save.combat.player.foodSlots, (writer, value) => { writer.setUint16(value[0]), writer.setUint32(value[1])});
    writer.setUint32(save.combat.player.summoningTimer.ticksLeft);
    writer.setUint32(save.combat.player.summoningTimer.maxTicks);
    writer.setBoolean(save.combat.player.summoningTimer.active);
    writer.setUint32(save.combat.player.soulPoints);
    writer.setUint8(save.combat.player.unholyPrayerMultiplier);
    writer.setUint32(save.combat.enemy.character.hp);
    writer.setUint8(save.combat.enemy.character.nextAction);
    writer.setUint32(save.combat.enemy.character.attackCount);
    writer.setUint16(save.combat.enemy.character.nextAttack);
    writer.setBoolean(save.combat.enemy.character.isAttacking);
    writer.setBoolean(save.combat.enemy.character.firstHit);
    writer.setUint32(save.combat.enemy.character.actionTimer.ticksLeft);
    writer.setUint32(save.combat.enemy.character.actionTimer.maxTicks);
    writer.setBoolean(save.combat.enemy.character.actionTimer.active);
    writer.setUint32(save.combat.enemy.character.regenTimer.ticksLeft);
    writer.setUint32(save.combat.enemy.character.regenTimer.maxTicks);
    writer.setBoolean(save.combat.enemy.character.regenTimer.active)
    writer.setUint32(save.combat.enemy.character.turnsTaken);
    writer.setUint32(save.combat.enemy.character.bufferedRegen);
    writer.setMap(save.combat.enemy.character.activeEffects,
        (writer, key) => writer.setUint16(key),
        (writer, value) => {
                writer.setBoolean(value.player),
                writer.setUint8(value.type),
                writer.setFloat64(value.damageDealt),
                writer.setFloat64(value.damasetaken),
                writer.setArray(value.parameters, (writer, value) => {writer.setString(value[0]), writer.setUint32(value[1])}),
                writer.setArray(value.statGroups, (writer, value) => {writer.setString(value[0]), writer.setUint32(value[1])}),
                writer.setArray(value.timers, (writer, value) => {
                    writer.setString(value[0]),
                    writer.setUint32(value[1]),
                    writer.setUint32(value[2]),
                    writer.setBoolean(value[3])
            })
        }
    );
    writer.setBoolean(save.combat.enemy.character.firstMiss);
    writer.setUint32(save.combat.enemy.character.barrier);
    writer.setUint8(save.combat.enemy.state);
    writer.setUint8(save.combat.enemy.attackType);
    writer.setBoolean(save.combat.enemy.enemy != undefined);
    if (save.combat.enemy.enemy != undefined)
        writer.setUint16(save.combat.enemy.enemy);
    writer.setBoolean(save.combat.enemy.damageType != undefined);
    if (save.combat.enemy.damageType != undefined)
        writer.setUint16(save.combat.enemy.damageType);
    writer.setBoolean(save.combat.fightInProgress);
    writer.setUint32(save.combat.fightTimer.ticksLeft);
    writer.setUint32(save.combat.fightTimer.maxTicks);
    writer.setBoolean(save.combat.fightTimer.active);
    writer.setBoolean(save.combat.combatActive);
    writer.setMap(save.combat.combatPassives,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setBoolean(value)
    );
    writer.setBoolean(save.combat.combatArea != undefined);
    if (save.combat.combatArea != undefined)
    {
        writer.setUint8(save.combat.combatArea.area),
        writer.setUint16(save.combat.combatArea.subArea)
    }
    writer.setUint32(save.combat.combatAreaProgress);
    writer.setBoolean(save.combat.monster != undefined);
    if (save.combat.monster != undefined)
        writer.setUint16(save.combat.monster);
    writer.setBoolean(save.combat.combatPaused);
    writer.setMap(save.combat.loot,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setUint32(value)
    );
    writer.setBoolean(save.combat.slayer.taskActive);
    writer.setBoolean(save.combat.slayer.task != undefined);
    if (save.combat.slayer.task != undefined)
        writer.setUint16(save.combat.slayer.task);
    writer.setUint32(save.combat.slayer.left);
    writer.setBoolean(save.combat.slayer.extended);
    writer.setBoolean(save.combat.slayer.category != undefined);
    if (save.combat.slayer.category != undefined)
        writer.setUint16(save.combat.slayer.category);
    writer.setMap(save.combat.slayer.categories,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setUint32(value)
    );
    writer.setUint32(save.combat.slayer.timer.ticksLeft);
    writer.setUint32(save.combat.slayer.timer.maxTicks);
    writer.setBoolean(save.combat.slayer.timer.active);
    writer.setUint16(save.combat.slayer.realm);
    writer.setBoolean(save.combat.event.active != undefined);
    if (save.combat.event.active != undefined)
        writer.setUint16(save.combat.event.active);
    writer.setArray(save.combat.event.passives, (writer, value) => writer.setUint16(value));
    writer.setArray(save.combat.event.passivesSelected, (writer, value) => writer.setUint16(value));
    writer.setUint32(save.combat.event.dungeonLength);
    writer.setMap(save.combat.event.activeEventAreas,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setUint32(value)
    );
    writer.setUint32(save.combat.event.progress);
    writer.setMap(save.combat.event.dungeonCompletions,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setUint32(value)
    );
    writer.setUint8(save.combat.event.strongholdTier);
    writer.setUint32(save.goblinRaid.player.character.hp);
    writer.setUint8(save.goblinRaid.player.character.nextAction);
    writer.setUint32(save.goblinRaid.player.character.attackCount);
    writer.setUint16(save.goblinRaid.player.character.nextAttack);
    writer.setBoolean(save.goblinRaid.player.character.isAttacking);
    writer.setBoolean(save.goblinRaid.player.character.firstHit);
    writer.setUint32(save.goblinRaid.player.character.actionTimer.ticksLeft);
    writer.setUint32(save.goblinRaid.player.character.actionTimer.maxTicks);
    writer.setBoolean(save.goblinRaid.player.character.actionTimer.active);
    writer.setUint32(save.goblinRaid.player.character.regenTimer.ticksLeft);
    writer.setUint32(save.goblinRaid.player.character.regenTimer.maxTicks);
    writer.setBoolean(save.goblinRaid.player.character.regenTimer.active);
    writer.setUint32(save.goblinRaid.player.character.turnsTaken);
    writer.setUint32(save.goblinRaid.player.character.bufferedRegen);
    writer.setMap(save.goblinRaid.player.character.activeEffects,
        (writer, key) => writer.setUint16(key),
        (writer, value) => {
                writer.setBoolean(value.player),
                writer.setUint8(value.type),
                writer.setFloat64(value.damageDealt),
                writer.setFloat64(value.damasetaken),
                writer.setArray(value.parameters, (writer, value) => {writer.setString(value[0]), writer.setUint32(value[1])}),
                writer.setArray(value.statGroups, (writer, value) => {writer.setString(value[0]), writer.setUint32(value[1])}),
                writer.setArray(value.timers, (writer, value) => {
                    writer.setString(value[0]),
                    writer.setUint32(value[1]),
                    writer.setUint32(value[2]),
                    writer.setBoolean(value[3])
            })
        }
    );
    writer.setBoolean(save.goblinRaid.player.character.firstMiss);
    writer.setUint32(save.goblinRaid.player.character.barrier);
    writer.setBoolean(save.goblinRaid.player.meleeType != undefined);
    if (save.goblinRaid.player.meleeType != undefined)
        writer.setUint16(save.goblinRaid.player.meleeType);
    writer.setBoolean(save.goblinRaid.player.rangedType != undefined);
    if (save.goblinRaid.player.rangedType != undefined)
        writer.setUint16(save.goblinRaid.player.rangedType);
    writer.setBoolean(save.goblinRaid.player.magicType != undefined);
    if (save.goblinRaid.player.magicType != undefined)
        writer.setUint16(save.goblinRaid.player.magicType);
    writer.setUint32(save.goblinRaid.player.prayerPoints);
    writer.setUint16(save.goblinRaid.player.equipmentSet);
    writer.setArray(save.goblinRaid.player.equipmentSets,
        (writer, value) => {
            writer.setArray(value.equipment, (writer, value) => {
                writer.setUint16(value.id);
                writer.setBoolean(value.stackable != undefined)
                if (value.stackable != undefined) {
                    writer.setUint16(value.stackable);
                    writer.setUint32(value.qty);
                }
                writer.setArray(value.quickEquip, (writer, value) => writer.setUint16(value));
            }),
            writer.setBoolean(value.spells.spell != undefined);
            if (value.spells.spell != undefined)
                writer.setUint16(value.spells.spell);
            writer.setBoolean(value.spells.aura != undefined);
            if (value.spells.aura != undefined)
                writer.setUint16(value.spells.aura);
            writer.setBoolean(value.spells.curse != undefined);
            if (value.spells.curse != undefined)
                writer.setUint16(value.spells.curse);
            writer.setArray(value.prayers, (writer, value) => writer.setUint16(value))
    });
    writer.setUint32(save.goblinRaid.player.foodSlot);
    writer.setUint32(save.goblinRaid.player.maxFoodSlot);
    writer.setArray(save.goblinRaid.player.foodSlots, (writer, value) => { writer.setUint16(value[0]), writer.setUint32(value[1])});
    writer.setUint32(save.goblinRaid.player.summoningTimer.ticksLeft);
    writer.setUint32(save.goblinRaid.player.summoningTimer.maxTicks);
    writer.setBoolean(save.goblinRaid.player.summoningTimer.active);
    writer.setUint32(save.goblinRaid.player.soulPoints);
    writer.setUint8(save.goblinRaid.player.unholyPrayerMultiplier);
    writer.setMap(save.goblinRaid.player.altAttacks,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setArray(value, (writer, value) => writer.setUint16(value))
    );
    writer.setUint32(save.goblinRaid.enemy.character.hp);
    writer.setUint8(save.goblinRaid.enemy.character.nextAction);
    writer.setUint32(save.goblinRaid.enemy.character.attackCount);
    writer.setUint16(save.goblinRaid.enemy.character.nextAttack);
    writer.setBoolean(save.goblinRaid.enemy.character.isAttacking);
    writer.setBoolean(save.goblinRaid.enemy.character.firstHit);
    writer.setUint32(save.goblinRaid.enemy.character.actionTimer.ticksLeft);
    writer.setUint32(save.goblinRaid.enemy.character.actionTimer.maxTicks);
    writer.setBoolean(save.goblinRaid.enemy.character.actionTimer.active);
    writer.setUint32(save.goblinRaid.enemy.character.regenTimer.ticksLeft);
    writer.setUint32(save.goblinRaid.enemy.character.regenTimer.maxTicks);
    writer.setBoolean(save.goblinRaid.enemy.character.regenTimer.active)
    writer.setUint32(save.goblinRaid.enemy.character.turnsTaken);
    writer.setUint32(save.goblinRaid.enemy.character.bufferedRegen);
    writer.setMap(save.goblinRaid.enemy.character.activeEffects,
        (writer, key) => writer.setUint16(key),
        (writer, value) => {
                writer.setBoolean(value.player),
                writer.setUint8(value.type),
                writer.setFloat64(value.damageDealt),
                writer.setFloat64(value.damasetaken),
                writer.setArray(value.parameters, (writer, value) => {writer.setString(value[0]), writer.setUint32(value[1])}),
                writer.setArray(value.statGroups, (writer, value) => {writer.setString(value[0]), writer.setUint32(value[1])}),
                writer.setArray(value.timers, (writer, value) => {
                    writer.setString(value[0]),
                    writer.setUint32(value[1]),
                    writer.setUint32(value[2]),
                    writer.setBoolean(value[3])
            })
        }
    );
    writer.setBoolean(save.goblinRaid.enemy.character.firstMiss);
    writer.setUint32(save.goblinRaid.enemy.character.barrier);
    writer.setUint8(save.goblinRaid.enemy.state);
    writer.setUint8(save.goblinRaid.enemy.attackType);
    writer.setBoolean(save.goblinRaid.enemy.enemy != undefined);
    if (save.goblinRaid.enemy.enemy != undefined)
        writer.setUint16(save.goblinRaid.enemy.enemy);
    writer.setBoolean(save.goblinRaid.enemy.goblin != undefined);
    if (save.goblinRaid.enemy.goblin != undefined) {
        writer.setString(save.goblinRaid.enemy.goblin.name),
        writer.setUint32(save.goblinRaid.enemy.goblin.hitpoints),
        writer.setUint32(save.goblinRaid.enemy.goblin.attack),
        writer.setUint32(save.goblinRaid.enemy.goblin.strength),
        writer.setUint32(save.goblinRaid.enemy.goblin.defence),
        writer.setUint32(save.goblinRaid.enemy.goblin.ranged),
        writer.setUint32(save.goblinRaid.enemy.goblin.magic),
        writer.setUint8(save.goblinRaid.enemy.goblin.attackType),
        writer.setInt8(save.goblinRaid.enemy.goblin.image),
        writer.setArray(save.goblinRaid.enemy.goblin.passives, (writer, value) => writer.setUint16(value)),
        writer.setUint32(save.goblinRaid.enemy.goblin.corruption)
    };
    writer.setBoolean(save.goblinRaid.inProgress);
    writer.setUint32(save.goblinRaid.spawnTimer.ticksLeft);
    writer.setUint32(save.goblinRaid.spawnTimer.maxTicks);
    writer.setBoolean(save.goblinRaid.spawnTimer.active);
    writer.setBoolean(save.goblinRaid.active);
    writer.setMap(save.goblinRaid.passives,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setBoolean(value)
    );
    writer.setMap(save.goblinRaid.playerModifiers,
        (writer, key) => writer.setUint16(key),
        (writer, value) => {
            writer.setFloat64(value[0])
            writer.setUint32(value[1]);
            var j = 2;
            for (var i = 1; i <= 256; i *= 2)
                if (value[1] & i) {
                    writer.setUint16(value[j]);
                    j += 1;
                }
        }
    );
    writer.setMap(save.goblinRaid.enemyModifiers,
        (writer, key) => writer.setUint16(key),
        (writer, value) => {
            writer.setFloat64(value[0])
            writer.setUint32(value[1]);
            var j = 2;
            for (var i = 1; i <= 256; i *= 2)
                if (value[1] & i) {
                    writer.setUint16(value[j]);
                    j += 1;
                }
        }
    );
    writer.setUint8(save.goblinRaid.state);
    writer.setUint8(save.goblinRaid.difficulty);
    writer.setArray(save.goblinRaid.bank.lockedItems, (writer, value) => writer.setUint16(value));
    writer.setArray(save.goblinRaid.bank.tabs,
        (writer, value) => writer.setMap(value, 
            (writer, key) => writer.setUint16(key),
            (writer, value) => writer.setUint32(value)
        )
    );
    writer.setMap(save.goblinRaid.bank.defaultTabs,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setUint8(value)
    )
    writer.setArray(save.goblinRaid.bank.sortOrder, (writer, value) => writer.setUint16(value));
    writer.setArray(save.goblinRaid.bank.glowing, (writer, value) => writer.setUint16(value));
    writer.setMap(save.goblinRaid.bank.icons,
        (writer, key) => writer.setUint8(key),
        (writer, value) => writer.setUint16(value)
    );
    writer.setUint32(save.goblinRaid.wave);
    writer.setUint32(save.goblinRaid.waveProgress);
    writer.setUint32(save.goblinRaid.killCount);
    writer.setFloat64(save.goblinRaid.start);
    writer.setArray(save.goblinRaid.ownedCrateItems, (writer, value) => writer.setUint16(value));
    writer.setMap(save.goblinRaid.randomModifiers,
        (writer, key) => writer.setUint16(key),
        (writer, value) => {
            writer.setFloat64(value[0])
            writer.setUint32(value[1]);
            var j = 2;
            for (var i = 1; i <= 256; i *= 2)
                if (value[1] & i) {
                    writer.setUint16(value[j]);
                    j += 1;
                }
        }
    );
    writer.setBoolean(save.goblinRaid.positiveModifier);
    writer.setMap(save.goblinRaid.items.weapons, 
        (writer, key) => writer.setUint16(key),
        (writer, value) => { 
            writer.setUint32(value.qty);
            writer.setBoolean(value.alt)
        }
    );
    writer.setMap(save.goblinRaid.items.armour, 
        (writer, key) => writer.setUint16(key),
        (writer, value) => { 
            writer.setUint32(value.qty);
            writer.setBoolean(value.alt)
        }
    );
    writer.setMap(save.goblinRaid.items.ammo, 
        (writer, key) => writer.setUint16(key),
        (writer, value) => { 
            writer.setUint32(value.qty);
            writer.setBoolean(value.alt)
        }
    );
    writer.setMap(save.goblinRaid.items.runes, 
        (writer, key) => writer.setUint16(key),
        (writer, value) => { 
            writer.setUint32(value.qty);
            writer.setBoolean(value.alt)
        }
    );
    writer.setMap(save.goblinRaid.items.food, 
        (writer, key) => writer.setUint16(key),
        (writer, value) => { 
            writer.setUint32(value.qty);
            writer.setBoolean(value.alt)
        }
    );
    writer.setMap(save.goblinRaid.items.passives, 
        (writer, key) => writer.setUint16(key),
        (writer, value) => { 
            writer.setUint32(value.qty);
            writer.setBoolean(value.alt)
        }
    );
    writer.setUint8(save.goblinRaid.itemCategory);
    writer.setUint8(save.goblinRaid.positiveModifiers);
    writer.setUint8(save.goblinRaid.negativeModifiers);
    writer.setBoolean(save.goblinRaid.paused);
    writer.setArray(save.goblinRaid.history, (writer, value) => {
        writer.setArray(value.skills, (writer, value) => writer.setUint32(value));
        writer.setArray(value.equipment, (writer, value) => writer.setUint16(value));
        writer.setUint32(value.ammo);
        writer.setMap(value.inventories,
            (writer, key) => writer.setUint16(key),
            (writer, value) => writer.setUint32(value)
        );
        writer.setUint16(value.food);
        writer.setUint32(value.foodQty);
        writer.setUint32(value.wave);
        writer.setUint32(value.kills);
        writer.setFloat64(value.time);
        writer.setUint32(value.coins);
        writer.setUint8(value.difficuilty);
    })
    writer.setMap(save.minibar,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setArray(value,
            (writer, value) => writer.setUint16(value)
        )
    );
    writer.setArray(save.pets, (writer, value) => writer.setUint16(value));
    writer.setMap(save.shop.items,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setUint32(value)
    );
    writer.setFloat64(save.shop.purchases);
    writer.setMap(save.itemCharges,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setUint32(value)
    );
    writer.setBoolean(save.tutorialComplete);
    writer.setMap(save.potions.list, 
        (writer, key) => writer.setUint16(key), 
        (writer, value ) => {
            writer.setUint16(value.item);
            writer.setUint32(value.charges)
        }
    );
    writer.setArray(save.potions.reuse, (writer, value) => writer.setUint16(value));

    writer.setMap(save.stats.woodcutting,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.fishing,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.firemaking,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.cooking,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.mining,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.smithing,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.attack,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.strength,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.defence,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.hitpoints,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.theiving,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.farming,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.ranged,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.fletching,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.crafting,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.runecrafting,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.magic,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.prayer,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.slayer,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.herblore,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.agility,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.summoning,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.items,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setMap(value, 
            (writer, key) => writer.setUint32(key),
            (writer, value) => writer.setFloat64(value)
        )
    )
    writer.setMap(save.stats.monsters,
        (writer, key) => writer.setUint16(key),
        (writer, value) => writer.setMap(value, 
            (writer, key) => writer.setUint32(key),
            (writer, value) => writer.setFloat64(value)
        )
    )
    writer.setMap(save.stats.general,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.combat,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.goblinRaid,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.astrology,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.shop,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.township,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.cartography,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.archaeology,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.corruption,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    writer.setMap(save.stats.harvesting,
        (writer, key) => writer.setUint32(key),
        (writer, value) => writer.setFloat64(value)
    );
    return writer.generateSaveString();
}