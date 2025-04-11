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
		}
	},
}

return Config