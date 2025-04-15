export type item = {
    namespace: string
    name: string
    image: string
}
type timer = {
    ticksLeft: number,
    maxTicks: number,
    active: boolean
}
type character = {
    hp: number,
    nextAction: number,
    attackCount: number,
    nextAttack: string,
    isAttacking: boolean,
    firstHit: boolean,
    actionTimer: timer,
    regenTimer :timer,
    turnsTaken: number,
    bufferedRegen: number,
    activeEffects: Map<number, effect>,
    firstMiss: boolean,
    barrier: number
}
type effect = {
    player: boolean,
    type: number,
    damageDealt: number,
    damageTaken: number,
    prameters: Array<string | number>,
    statGroups: Array<string | number>,
    timers: Array<string | number | boolean>
}
type equipment = {
    id: number,
    stackable: number | undefined,
    qty: number | undefined,
    quickEquip: Array<number>
}
type equipmentSet = {
    equipment: Array<equipment>,
    spells: {
        spell: number | undefined,
        aura: number | undefined,
        curse: number | undefined
    },
    prayers: Array<number>
}
type goblin = {
    name: string,
    hitpoints: number,
    attack: number,
    strength: number,
    defence: number,
    ranged: number,
    magic: number,
    attackType: number,
    image: number,
    passives: Array<number>,
    corruption: number
}
type bank = {
    lockedItems: Array<string>,
    tabs: Array<Map<string, number>>,
    defaultTabs: Map<string, number>,
    sortOrder: Array<string>,
    glowing: Array<string>,
    icons: Map<number, string>
}
type raidHistory = {
    skills: Array<number>,
    equipment: Array<number>,
    ammo: number,
    inventories: Map<number, number>,
    food: number,
    foodQty: number,
    wave: number,
    kills: number,
    time: number,
    coins: number,
    difficulty: number
}
type keybinding = {
    key: boolean,
    alt: boolean,
    ctrl: boolean,
    meta: boolean,
    shift: boolean
}
type pushNotification = {
    id: string,
    startDate: number,
    endDate: number,
    notificationType: number,
    platform: string,
}
type currency = {
    qty: number,
    stats: Map<number, number>,
    currencySkills: Map<number, Map<number, number>>
}
type capIncrease = {
    given: Array<number>,
    increases: Array<number>
}


type skill = {
    xp: number,
    skillUnlocked: boolean,
    relics: Map<number, Map<number, number>>,
    levelCap: number,
    abyssalLevelCap: number,
    skillTrees: Map<number, Map<number, boolean> | number>,
    abyssalXP: number,
    realm: number,
    active: boolean | undefined,
    timer: timer | undefined,
    mastery: mastery | undefined,
    excessData:ArrayBuffer | undefined,
    skillSpecific:  artisanSkill | 
                    archaeologySkill | 
                    agilitySkill | 
                    magicSkill | 
                    astrologySkill | 
                    cartographySkill | 
                    cookingSkill | 
                    farmingSkill | 
                    firemakingSkill | 
                    fishingSkill | 
                    fletchingSkill | 
                    summoningSkill | 
                    thievingSkill | 
                    townshipSkill | 
                    woodcuttingSkill | 
                    miningSkill | 
                    corruptionSkill | 
                    harvestingSkill
}
type mastery = {
    actionMastery: Map<number, number>,
    masteryPool: Map<number, number>,
}
type artisanSkill = {
    recipe: number | undefined
}
type map = {
    upgradeActions: number,
    charges: number,
    artefactValuesTiny: number,
    artefactValuesSmall: number,
    artefactValuesMedium: number,
    artefactValuesLarge: number,
    refinements: Map<number, Array<number>>
}
type digsite = {
    maps: Array<map>,
    selectedMap: number,
    selectedTools: Array<number>,
    selectedUpgrade: number
}
type museum = {
    items: Map<number, boolean>,
    donated: Array<number>
}
type archaeologySkill = {
    digsite: number | undefined,
    digsites: Map<number, digsite>,
    museum: museum,
    hiddenDigsites: Array<number>
}
type blueprint = {
    name: string,
    obstacles: Map<number, Number>,
    pillars: Map<number, number>
}
type course = {
    builtObstacles: Map<number, number>,
    builtPillars: Map<number, number>,
    blueprints: Map<number, blueprint>
}
type agilitySkill = {
    activeObstacle: number,
    obstacleBuildCount: Map<number, number>
    courses: Map<number, course>
}
type magicSkill = {
    spell: number | undefined,
    conversionItem: number | undefined,
    selectedRecipe: number | undefined,
}
type astrologyRecipie = {
    recipie: number,
    standardModsBought: Array<number>,
    uniqueModsBought: Array<number>,
    abyssalModsBought: Array<number>
}
type astrologySkill = {
    studied: number | undefined,
    explored: number | undefined,
    actions: Array<astrologyRecipie>,
    dummyRecipies: Array<astrologyRecipie>
}
type poi = {
    discovered: boolean,
    fastTravelUnlocked: number,
    discoveryMovesLeft: number,
    surveyOrder: number
}
type cartographyWorldMap = {
    worldMap: Map< number, Map<number, number>>,
    position: Array<number>,
    filterSettings: {
        markerSettings: Array<boolean>,
        hiddenFastTravelGroups: Array<number>
    },
    pois: Map<number, poi>,
    bonus: Map<number, boolean>
}
type cartographySkill = {
    worldMaps: Map<number, cartographyWorldMap>,
    actionMode: number,
    map: {
        activeMap: number,
        surveyQueue: Array<number>,
        autoSurvey: Array<number> | undefined
    } | undefined,
    event: number | undefined
    paperRecipe: number | undefined
    digSite: number | undefined
}
type cookingSkill = {
    selectedRecipies: Map<number, number>,
    passiveCookTimers: Map<number, timer>,
    stockpileItems: Map<number, {item: number, qty: number}>,
    activeCategory: number | undefined
}
type farmingPlot = {
    state: number,
    planted: number | undefined,
    compost: number | undefined,
    compostLevel: number,
    selected: number | undefined,
    growthTime: number
}
type farmingSkill = {
    plots: Map<number, farmingPlot>,
    dummyPlots: Map<number, farmingPlot>,
    growthTimers: Array<timer>
}
type firemakingSkill = {
    bonfireTimer: timer,
    recipe: number | undefined,
    bonfireRecipe: number | undefined,
    oilTimer: timer,
    oiledLogRecipe: number | undefined,
    oilRecipe: number | undefined,
}
type fishingSkill = {
    secretAreaUnlocked: boolean,
    area: number | undefined,
    selectedAreaFish: Map<number, number>,
    hiddenAreas: Array<number>,
    contest:  {
        completion: Array<boolean>,
        mastery: Array<boolean>
    } | undefined
}
type fletchingSkill = {
    recipe: number | undefined,
    altRecipies: Map<number, number>
}
type summoningSkill = {
    recipe: number | undefined,
    selectedNonShardCosts: Map<number, number>,
    marksUnlocked: Map<number, number>
}
type thievingSkill = {
    stunTimer: timer,
    area: number | undefined,
    npc: number | undefined,
    hiddenAreas: Array<number>,
    stunState: number
}
type townshipResource = {
    qty: number,
    cap: number
}
type townshipBiome = {
    buildingsBuilt: Map<number, number>,
    buildingEfficiency: Map<number, number>
}
type townshipSkill = {
    townData: {
        worship: number,
        created: boolean,
        seasonTicksRemaining: number,
        season: number | undefined,
        previousSeason: number | undefined,
        health: number,
        souls: number,
        abyssalWaveTicksRemaining: number
    },
    resources: Map<number, townshipResource>,
    dummyResources: Map<number, townshipResource>,
    biomes: Map<number, townshipBiome>,
    dummyBiomes: Map<number, townshipBiome>,
    legacyTicks: number,
    totalTicks: number,
    tasksCompleted: Array<number>,
    townshipConverted: boolean,
    casualTasks: {
        completed: number,
        currentCasualTasks: Map<number, Array<number>>,
        newTaskTimer: timer
    },
    tickTimer: timer,
    displayReworkNotification: boolean,
    gpRefunded: number,
    abyssalWaveTimer: timer
}
type woodcuttingSkill = {
    activetrees: Array<number>
}
type rock = {
    isRespawning: boolean,
    currentHP: number,
    maxHP: number
}
type miningSkill = {
    selectedRock: number | undefined,
    rocks: Map<number, rock>,
    rockRespawnTimers: Map<number, timer>,
    passiveRegenTimer: timer
}
type corruptionSkill = {
    corruptionEffects: Map<number, boolean>,
    corruptionUnlockedRows: Array<number>
}
type harvestingSkill = {
    selectedVein: number | undefined,
    veins: Map<number, {currentIntensity: number, maxIntensity: number}>,
    veinDecayTimer: timer
}

export type saveData = {
    header: {
        saveVersion: number,
        saveName: string,
        gameMode: string,
        skillLevel: number,
        gp: number,
        activeTraining: boolean,
        activeTrainingName: string,
        tickTime: number,
        saveTime: number,
        activeNamespaces: Set<string>,
        mods: {
            profileId: string,
            profileName: string,
            mods: Set<number>
        } | undefined,
        namespaces: Map<string, Map<string, number>>
    },
    tickTime: number,
    saveTime: number,
    activeAction: string | undefined,
    pausedAction: string | undefined,
    paused: boolean,
    merchantsPermitRead: boolean,
    gameMode: string,
    characterName: string,
    bank: bank,
    combat: {
        player: {
            character: character,
            meleeType: string | undefined,
            rangedType: string | undefined,
            magicType: string | undefined,
            prayerPoints: number,
            equipmentSet: number,
            equipmentSets: Array<equipmentSet>,
            foodSlot: number,
            foodSlots: Array<{item: string, qty: number}>,
            maxFoodSlot: number,
            summoningTimer: timer,
            soulPoints: number,
            unholyPrayerMultiplier: number
        },
        enemy: {
            character: character,
            state: number,
            attackType: number,
            enemy: string | undefined,
            damageType: string | undefined
        },
        fightInProgress: boolean,
        fightTimer: timer,
        combatActive: boolean,
        combatPassives: Map<number, boolean>,
        combatArea: {
            area: number,
            subArea: string
        } | undefined,
        combatAreaProgress: number,
        monster: string | undefined,
        combatPaused: boolean,
        loot: Map<number, number>,
        slayer: {
            taskActive: boolean,
            task: string | undefined,
            left: number,
            extended: boolean,
            category: string | undefined,
            categories: Map<number, number>,
            timer: timer,
            realm: string
        },
        event: {
            active: string | undefined,
            passives: Array<number>,
            passivesSelected: Array<number>,
            dungeonLength: number,
            dungeonCompletions: Map<number, number>,
            activeEventAreas: Map<number, number>,
            progress: number,
            strongholdTier: number
        }
    },
    goblinRaid: {
        player: {
            character: character,
            meleeType: string | undefined,
            rangedType: string | undefined,
            magicType: string | undefined,
            prayerPoints: number,
            equipmentSet: number,
            equipmentSets: Array<equipmentSet>,
            foodSlot: number,
            foodSlots: Array<{item: string, qty: number}>,
            maxFoodSlot: number,
            summoningTimer: timer,
            soulPoints: number,
            unholyPrayerMultiplier: number
            altAttacks: Map<number, Array<number>>
        },
        enemy: {
            character: character,
            state: number,
            attackType: number,
            enemy: string | undefined,
            goblin: goblin | undefined
        },
        inProgress: boolean,
        spawnTimer: timer,
        active: boolean,
        passives: Map<number, boolean>,
        playerModifiers: Map<number, Array<number>>,
        enemyModifiers: Map<number, Array<number>>,
        state: number,
        difficulty: number,
        bank: bank,
        wave: number,
        waveProgress: number,
        killCount: number,
        start: number,
        ownedCrateItems: Array<number>,
        randomModifiers: Map<number, Array<number>>,
        positiveModifier: boolean,
        items: {
            weapons: Map<number, { qty: number, alt: boolean}>,
            armour: Map<number, { qty: number, alt: boolean}>,
            ammo: Map<number, { qty: number, alt: boolean}>,
            runes: Map<number, { qty: number, alt: boolean}>,
            food: Map<number, { qty: number, alt: boolean}>,
            passives: Map<number, { qty: number, alt: boolean}>
        },
        itemCategory: number,
        positiveModifiers: number,
        negativeModifiers: number,
        paused: boolean,
        history: Array<raidHistory>
    },
    minibar: Map<number, Array<number>>,
    pets: Array<number>,
    shop: {
        items: Map<number, number>,
        purchases: number
    },
    itemCharges: Map<number, number>,
    tutorialComplete: boolean,
    potions: {
        list: Map<number, {item: number, qty: number}>,
        reuse: Array<number>
    },
    stats: {
        woodcutting: Map<number, number>,
        fishing: Map<number, number>,
        firemaking: Map<number, number>,
        cooking: Map<number, number>,
        mining: Map<number, number>,
        smithing: Map<number, number>,
        attack: Map<number, number>,
        strength: Map<number, number>,
        defence: Map<number, number>,
        hitpoints: Map<number, number>,
        theiving: Map<number, number>,
        farming: Map<number, number>,
        ranged: Map<number, number>,
        fletching: Map<number, number>,
        crafting: Map<number, number>,
        runecrafting: Map<number, number>,
        magic: Map<number, number>,
        prayer: Map<number, number>,
        slayer: Map<number, number>,
        herblore: Map<number, number>,
        agility: Map<number, number>,
        summoning: Map<number, number>,
        items: Map<number, Map<number, number>>,
        monsters: Map<number, Map<number, number>>,
        general: Map<number, number>,
        combat: Map<number, number>,
        goblinRaid: Map<number, number>,
        astrology: Map<number, number>,
        shop: Map<number, number>,
        township: Map<number, number>,
        cartography: Map<number, number>,
        archaeology: Map<number, number>,
        corruption: Map<number, number>,
        harvesting: Map<number, number>
    },
    settings: {
        continueIfBankFull: boolean,
        continueThievingOnStun: boolean,
        autoRestartDungeon: boolean,
        autoCloudSave: boolean,
        darkMode: boolean,
        showGPNotifications: boolean,
        enableAccessibility: boolean,
        showEnemySkillLevels: boolean,
        showCloseConfirmations: boolean,
        hideThousandsSeperator: boolean,
        showVirtualLevels: boolean,
        showSaleConfirmations: boolean,
        showShopConfirmations: boolean,
        pauseOnUnfocus: boolean,
        showCombatMinibar: boolean,
        showCombatMinibarCombat: boolean,
        showSkillingMinibar: boolean,
        useCombinationRunes: boolean,
        enableAutoSlayer: boolean,
        showItemNotifications: boolean,
        useSmallLevelUpNotifications: boolean,
        useDefaultBankBorders: boolean,
        defaultToCurrentEquipSet: boolean,
        hideMaxLevelMasteries: boolean,
        showMasteryCheckpointconfirmations: boolean,
        enableOfflinePushNotifications: boolean,
        enableFarmingPushNotifications: boolean,
        enableOfflineCombat: boolean,
        enableMiniSidebar: boolean,
        enableAutoEquipFood: boolean,
        enableAutoSwapFood: boolean,
        enablePerfectCooking: boolean,
        showCropDestructionConfirmations: boolean,
        showAstrologyMaxRollConfirmations: boolean,
        showQuantityInItemNotifications: boolean,
        showItemPreservationNotifications: boolean,
        showSlayerCoinNotifications: boolean,
        showEquipmentSetsInCombatMinibar: boolean,
        showBarsInCombatMinibar: boolean,
        showCombatStunNotifications: boolean,
        showCombatSleepNotifications: boolean,
        showSummoningMarkDiscoveryModals: boolean,
        enableCombatDamageSplashes: boolean,
        enableProgressBars: boolean,
        showTierIPotions: boolean,
        showTierIIPotions: boolean,
        showTierIIIPotions: boolean,
        showTierIVPotions: boolean,
        showNeutralAttackModifiers: boolean,
        defaultPageOnLoad: string,
        formatNumberSetting: number,
        bankSortOrder: number,
        colourBlindMode: number,
        enableEyebleachMode: boolean,
        enableQuickConvert: boolean,
        showLockedTownshipBuildings: boolean,
        useNewNotifications: boolean,
        notificationHorizontalPosition: number,
        notificationDisappearDelay: number,
        showItemNamesInNotifications: boolean,
        importanceSummoningMarkFound: boolean,
        importanceErrorMessages: boolean,
        enableScrollableBankTabs: boolean,
        showWikiLinks: boolean,
        disableHexGridOutsideSight: boolean,
        mapTextureQuality: number,
        enableMapAntialiasing: boolean,
        showSkillXPNotifications: boolean,
        backgroundImage: number,
        superDarkMode: boolean,
        showExpansionBackgroundColours: boolean,
        showCombatAreaWarnings: boolean,
        useCompactNotifications: boolean,
        useLegacyNotifications: boolean,
        useCat: boolean,
        throttleFrameRateOnInactivity: boolean,
        cartographyFrameRateCap: number,
        toggleBirthdayEvent: boolean,
        toggleDiscordRPC: boolean,
        genericArtefactAllButOne: boolean,
        hiddenMasteryNamespaces: Array<string>,
        enableDoubleClickEquip: boolean,
        enableDoubleClickOpen: boolean,
        enableDoubleClickBury: boolean,
        showAbyssalPiecesNotifications: boolean,
        showAbyssalSlayerCoinNotifications: boolean,
        enablePermaCorruption: boolean,
        showAPNextToShopSidebar: boolean,
        showASCNextToSlayerSidebar: boolean,
        sidebarLevels: number,
        showAbyssalXPNotifications: boolean,
        showSPNextToPrayerSidebar: boolean,
        enableStickyBankTabs: boolean,
        useLegacyRealmSelection: boolean,
        showOpacityForSkillNavs: boolean,
        bankFilterShowAll: boolean,
        bankFilterShowDemo: boolean,
        bankFilterShowFull: boolean,
        bankFilterShowTotH: boolean,
        bankFilterShowAoD: boolean,
        bankFilterShowItA: boolean,
        bankFilterShowDamageReduction: boolean,
        bankFilterShowAbyssalResistance: boolean,
        bankFilterShowNormalDamage: boolean,
        bankFilterShowAbyssalDamage: boolean,
        bankFilterShowSkillXP: boolean,
        bankFilterShowAbyssalXP: boolean,
        alwaysShowRealmSelectAgility: boolean,
        enableSwipeSidebar: boolean,
        keyBindings: Map<number, Array<keybinding | undefined>>
    },
    news: Array<string>,
    lastLoadedGameVersion: string,
    scheduledPushNotifications: Array<pushNotification>,
    skills: Map<string, skill>,
    mods: Map<number, {settings: string, storage: string}>,
    completion: {
        completion: string,
        birthdayCompletions: Array<boolean>,
        clueHuntStep: number,
        areaCompletions: Map<number, number>,
        strongholdCompletions: Map<number, number>
    },
    currencies: Map<number, currency>,
    levelCapIncreases: {
        increases: Map<number, capIncrease>,
        selected: Array<number>,
        bought: number,
        abyssalBought: number,
    },
    realm: string
}