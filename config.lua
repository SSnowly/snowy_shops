Config = {}


Config.Categories = {
    general = {
        {
            id = "Food",
            name = "Food",
            icon = "fa-solid fa-burger"
        },
        {
            id = "Drinks",
            name = "Drinks",
            icon = "fa-solid fa-mug-hot"
        },
        {
            id = "Alcohol",
            name = "Alcohol",
            icon = "fa-solid fa-wine-glass"
        },
        {
            id = "Misc",
            name = "Misc",
            icon = "fa-solid fa-box"
        }
    },
    weaponstore = {
        {
            id = "Weapons",
            name = "Weapons",
            icon = "fa-solid fa-gun"
        },
        {
            id = "Ammo",
            name = "Ammo",
            icon = "fa-solid fa-box-open"
        }
    },
}


Config.Shops = {
    General = {
        title = 'Shop',
        categories = Config.Categories.general,
        items = {
            { name = 'burger', price = 10, category = 'Food' },
			{ name = 'water', price = 10, category = 'Drinks' },
			{ name = 'cola', price = 10, category = 'Drinks' },
        },
		blip = {
			id = 59, colour = 69, scale = 0.8
		},
        targets = {
			{ loc = vec3(25.06, -1347.32, 29.5), length = 0.7, width = 0.5, heading = 0.0, minZ = 29.5, maxZ = 29.9, distance = 1.5 },
			{ loc = vec3(-3039.18, 585.13, 7.91), length = 0.6, width = 0.5, heading = 15.0, minZ = 7.91, maxZ = 8.31, distance = 1.5 },
			{ loc = vec3(-3242.2, 1000.58, 12.83), length = 0.6, width = 0.6, heading = 175.0, minZ = 12.83, maxZ = 13.23, distance = 1.5 },
			{ loc = vec3(1728.39, 6414.95, 35.04), length = 0.6, width = 0.6, heading = 65.0, minZ = 35.04, maxZ = 35.44, distance = 1.5 },
			{ loc = vec3(1698.37, 4923.43, 42.06), length = 0.5, width = 0.5, heading = 235.0, minZ = 42.06, maxZ = 42.46, distance = 1.5 },
			{ loc = vec3(1960.54, 3740.28, 32.34), length = 0.6, width = 0.5, heading = 120.0, minZ = 32.34, maxZ = 32.74, distance = 1.5 },
			{ loc = vec3(548.5, 2671.25, 42.16), length = 0.6, width = 0.5, heading = 10.0, minZ = 42.16, maxZ = 42.56, distance = 1.5 },
			{ loc = vec3(2678.29, 3279.94, 55.24), length = 0.6, width = 0.5, heading = 330.0, minZ = 55.24, maxZ = 55.64, distance = 1.5 },
			{ loc = vec3(2557.19, 381.4, 108.62), length = 0.6, width = 0.5, heading = 0.0, minZ = 108.62, maxZ = 109.02, distance = 1.5 },
			{ loc = vec3(373.13, 326.29, 103.57), length = 0.6, width = 0.5, heading = 345.0, minZ = 103.57, maxZ = 103.97, distance = 1.5 },
            { loc = vec3(1134.9, -982.34, 46.41), length = 0.5, width = 0.5, heading = 96.0, minZ = 46.4, maxZ = 46.8, distance = 1.5 },
			{ loc = vec3(-1222.33, -907.82, 12.43), length = 0.6, width = 0.5, heading = 32.7, minZ = 12.3, maxZ = 12.7, distance = 1.5 },
			{ loc = vec3(-1486.67, -378.46, 40.26), length = 0.6, width = 0.5, heading = 133.77, minZ = 40.1, maxZ = 40.5, distance = 1.5 },
			{ loc = vec3(-2967.0, 390.9, 15.14), length = 0.7, width = 0.5, heading = 85.23, minZ = 15.0, maxZ = 15.4, distance = 1.5 },
			{ loc = vec3(1165.95, 2710.20, 38.26), length = 0.6, width = 0.5, heading = 178.84, minZ = 38.1, maxZ = 38.5, distance = 1.5 },
			{ loc = vec3(1393.0, 3605.95, 35.11), length = 0.6, width = 0.6, heading = 200.0, minZ = 35.0, maxZ = 35.4, distance = 1.5 }

		}
	},
    Ammunation = {
		title = 'Ammunation',
        categories = Config.Categories.weaponstore,
		blip = {
			id = 110, colour = 69, scale = 0.8
		}, 
        items = {
			{ name = 'ammo-9', price = 5, category = 'Ammo' },
			{ name = 'WEAPON_KNIFE', price = 200, category = 'Weapons' },
			{ name = 'WEAPON_BAT', price = 100, category = 'Weapons' },
			{ name = 'WEAPON_PISTOL', price = 1000, metadata = { registered = true }, license = 'weapon', category = 'Weapons' }
		}, 
        targets = {
			{ loc = vec3(-660.92, -934.10, 21.94), length = 0.6, width = 0.5, heading = 180.0, minZ = 21.8, maxZ = 22.2, distance = 2.0 },
			{ loc = vec3(808.86, -2158.50, 29.73), length = 0.6, width = 0.5, heading = 360.0, minZ = 29.6, maxZ = 30.0, distance = 2.0 },
			{ loc = vec3(1693.57, 3761.60, 34.82), length = 0.6, width = 0.5, heading = 227.39, minZ = 34.7, maxZ = 35.1, distance = 2.0 },
			{ loc = vec3(-330.29, 6085.54, 31.57), length = 0.6, width = 0.5, heading = 225.0, minZ = 31.4, maxZ = 31.8, distance = 2.0 },
			{ loc = vec3(252.85, -51.62, 70.0), length = 0.6, width = 0.5, heading = 70.0, minZ = 69.9, maxZ = 70.3, distance = 2.0 },
			{ loc = vec3(23.68, -1106.46, 29.91), length = 0.6, width = 0.5, heading = 160.0, minZ = 29.8, maxZ = 30.2, distance = 2.0 },
			{ loc = vec3(2566.59, 293.13, 108.85), length = 0.6, width = 0.5, heading = 360.0, minZ = 108.7, maxZ = 109.1, distance = 2.0 },
			{ loc = vec3(-1117.61, 2700.26, 18.67), length = 0.6, width = 0.5, heading = 221.82, minZ = 18.5, maxZ = 18.9, distance = 2.0 },
			{ loc = vec3(841.05, -1034.76, 28.31), length = 0.6, width = 0.5, heading = 360.0, minZ = 28.2, maxZ = 28.6, distance = 2.0 }
		}
	},

    YouTool = {
		title = 'YouTool',
        categories = {
            {
                id = "Tools",
                name = "Tools",
                icon = "fa-solid fa-wrench"
            }
        },
		blip = {
			id = 402, colour = 69, scale = 0.8
		}, 
        items = {
			{ name = 'lockpick', price = 10, category = 'Tools' }
		}, 
        targets = {
			{ loc = vec3(2746.8, 3473.13, 55.67), length = 0.6, width = 3.0, heading = 65.0, minZ = 55.0, maxZ = 56.8, distance = 3.0 }
		}
	},

    PoliceArmoury = {
		title = 'Police Armoury',
        categories = Config.Categories.weaponstore,
        groups = "police",
		blip = {
			id = 110, colour = 84, scale = 0.8
		}, items = {
			{ name = 'ammo-9', price = 5, category = 'Ammo' },
			{ name = 'ammo-rifle', price = 5, category = 'Ammo' },
			{ name = 'WEAPON_FLASHLIGHT', price = 200, category = 'Weapons' },
			{ name = 'WEAPON_NIGHTSTICK', price = 100, category = 'Weapons' },
			{ name = 'WEAPON_PISTOL', price = 500, metadata = { registered = true, serial = 'POL' }, license = 'weapon', category = 'Weapons' },
			{ name = 'WEAPON_CARBINERIFLE', price = 1000, metadata = { registered = true, serial = 'POL' }, license = 'weapon', grade = 3, category = 'Weapons' },
			{ name = 'WEAPON_STUNGUN', price = 500, metadata = { registered = true, serial = 'POL'}, category = 'Weapons' }
		}, locations = {
			vec3(451.51, -979.44, 30.68)
		}, targets = {
			{ loc = vec3(453.21, -980.03, 30.68), length = 0.5, width = 3.0, heading = 270.0, minZ = 30.5, maxZ = 32.0, distance = 6 }
		}
	},
}

return Config