RegisterNetEvent('snowy_shops:server:purchaseItems', function(data)
    local src = source
    local Player = exports.qbx_core:GetPlayer(src)
    if not Player then return end

    if not Config.Shops[data.shopId] then
        lib.notify(src, {
            title = 'Error',
            description = 'Invalid shop',
            type = 'error'
        })
        return
    end
    if Config.Shops[data.shopId].group and not Config.Shops[data.shopId].group == Player.PlayerData.job.name or Config.Shops[data.shopId].group == Player.PlayerData.gang.name then
        print("[WARNING] Player " .. src .. " tried to purchase items from a shop they are not allowed to purchase from")
        return
    end
    local total = 0
    local validItems = {}

    for itemName, quantity in pairs(data.items) do
        local shopItem
        for _, item in ipairs(Config.Shops[data.shopId].items) do
            if item.name == itemName then
                if item.license and not Player.PlayerData.metadata.licences[item.license] then
                    lib.notify(src, {
                        title = 'Error',
                        description = 'You do not have a license for this item',
                        type = 'error'
                    })
                    return
                end
                if item.grade and item.grade > Player.PlayerData.job.grade.level then
                    lib.notify(src, {
                        title = 'Error',
                        description = 'You do not have the required grade to purchase this item',
                        type = 'error'
                    })
                    return
                end
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

    for _, item in ipairs(validItems) do
        if item.metadata then
            if not exports.ox_inventory:AddItem(src, item.id, item.quantity, item.metadata) then
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
        else
            if not exports.ox_inventory:AddItem(src, item.id, item.quantity) then
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
    end

    lib.notify(src, {
        title = 'Purchase successful',
        description = ('Bought %d items for $%d'):format(#validItems, total),
        type = 'success'
    })
end)
