local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent('snowy_shops:server:purchaseItems', function(data)
    local src = source
    local Player = exports.qbx_core:GetPlayer(src)
    if not Player then return end

    -- Validate shop exists
    if not Config.Shops[data.shopId] then
        lib.notify(src, {
            title = 'Error',
            description = 'Invalid shop',
            type = 'error'
        })
        return
    end

    -- Calculate total and validate items
    local total = 0
    local validItems = {}
    
    for itemName, quantity in pairs(data.items) do
        -- Find the item in the shop's items array
        local shopItem
        for _, item in ipairs(Config.Shops[data.shopId].items) do
            if item.name == itemName then
                shopItem = item
                break
            end
        end

        if not shopItem then
            lib.notify(src, {
                title = 'Error',
                description = 'Invalid item in cart: ' .. itemName,
                type = 'error'
            })
            return
        end
        
        total = total + (shopItem.price * quantity)
        table.insert(validItems, {
            id = itemName,
            quantity = quantity,
            price = shopItem.price
        })
    end

    -- Check if player has enough money
    if data.paymentMethod == 'card' then
        if Player.PlayerData.money.bank < total then
            lib.notify(src, {
                title = 'Error',
                description = 'Not enough money in bank',
                type = 'error'
            })
            return
        end
    else
        local hasMoney = exports.ox_inventory:GetItem(src, 'money', nil, true)
        if not hasMoney or hasMoney < total then
            lib.notify(src, {
                title = 'Error',
                description = 'Not enough cash',
                type = 'error'
            })
            return
        end
    end

    -- Remove money
    if data.paymentMethod == 'card' then
        if not exports.qbx_core:RemoveMoney(src, 'bank', total) then
            lib.notify(src, {
                title = 'Error',
                description = 'Failed to remove money',
                type = 'error'
            })
        end
    else
        if not exports.qbx_core:RemoveMoney(src, 'cash', total) then
            lib.notify(src, {
                title = 'Error',
                description = 'Failed to remove money',
                type = 'error'
            })
        end
    end

    -- Give items
    for _, item in ipairs(validItems) do
        if not exports.ox_inventory:AddItem(src, item.id, item.quantity, Config.Shops[data.shopId].items[item.id].metadata and Config.Shops[data.shopId].items[item.id].metadata or nil) then
            -- If adding item fails, refund the money
            if data.paymentMethod == 'card' then
                exports.qbx_core:AddMoney(src, 'bank', total, 'Refunded')
            else
                exports.qbx_core:AddMoney(src, 'cash', total, 'Refunded')
            end
            
            lib.notify(src, {
                title = 'Error',
                description = 'Failed to give items, money refunded',
                type = 'error'
            })
            return
        end
    end

    -- Success notification
    lib.notify(src, {
        title = 'Purchase successful',
        description = ('Bought %d items for $%d'):format(#validItems, total),
        type = 'success'
    })
end)
