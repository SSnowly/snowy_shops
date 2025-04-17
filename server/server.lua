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
    local closeToShop = false
    for _, target in ipairs(Config.Shops[data.shopId].targets) do
        local coords = target.loc
        if #(GetEntityCoords(GetPlayerPed(src)) - vector3(coords.x, coords.y, coords.z)) < 5.0 then
            closeToShop = true
            break
        end
    end
    if not closeToShop then
        print("[WARNING] Player " .. src .. " tried to purchase items from a shop they are not close to")
        return
    end



    if Config.Shops[data.shopId].group then
        if type(Config.Shops[data.shopId].group) == "string" then
            if Player.PlayerData.job.name ~= Config.Shops[data.shopId].group and Player.PlayerData.gang.name ~= Config.Shops[data.shopId].group then
                lib.notify(src, {
                    title = 'Error',
                    description = 'You are not allowed to purchase from this shop',
                    type = 'error'
                })
                return
            end
        else
            local hasAccess = false
            for group, grade in pairs(Config.Shops[data.shopId].group) do
                local hasAccess = false
                if Player.PlayerData.job.name == group and Player.PlayerData.job.grade.level >= grade then
                    hasAccess = true
                    break
                elseif Player.PlayerData.gang.name == group and Player.PlayerData.gang.grade.level >= grade then
                    hasAccess = true
                    break
                end
            end
            if not hasAccess then
                lib.notify(src, {
                    title = 'Error',
                    description = 'You are not allowed to purchase from this shop',
                    type = 'error'
                })
                return
            end

        end
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
                local itemCategory = {}
                for _, category in ipairs(Config.Shops[data.shopId].categories) do
                    if category.id == item.category then
                        itemCategory = category
                        break
                    end
                end
                if next(itemCategory) == nil then
                    lib.notify(src, {
                        title = 'Error',
                        description = 'Invalid item category: ' .. item.category,
                        type = 'error'
                    })
                    return
                end

                if itemCategory.groups then
                    if type(itemCategory.groups) == "string" then
                        if not (Player.PlayerData.job.name == itemCategory.groups and Player.PlayerData.job.grade.level >= itemCategory.grade) or (Player.PlayerData.gang.name == itemCategory.groups and Player.PlayerData.gang.grade.level >= itemCategory.grade) then
                            lib.notify(src, {
                                title = 'Error',
                                description = 'You are not allowed to purchase this item',
                                type = 'error'
                            })
                            return
                        end
                    else
                        local hasAccess = false
                        for group, grade in pairs(itemCategory.groups) do
                            if Player.PlayerData.job.name == group and Player.PlayerData.job.grade.level >= grade then
                                hasAccess = true
                                break
                            elseif Player.PlayerData.gang.name == group and Player.PlayerData.gang.grade.level >= grade then
                                hasAccess = true
                                break
                            end
                        end
                        if not hasAccess then
                            lib.notify(src, {
                                title = 'Error',
                                description = 'You are not allowed to purchase this item',
                                type = 'error'
                            })
                            return
                        end
                    end
 
                end
                
                if item.license and not Player.PlayerData.metadata.licences[item.license] then
                    lib.notify(src, {
                        title = 'Error',
                        description = 'You do not have a license for this item',
                        type = 'error'
                    })
                    return
                end
                
                if item.grade and ((Player.PlayerData.job and Player.PlayerData.job.grade.level < item.grade) or (Player.PlayerData.gang and Player.PlayerData.gang.grade.level < item.grade)) then
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

    local hasSpace = true
    for _, item in ipairs(validItems) do
        if not exports.ox_inventory:CanCarryItem(src, item.id, item.quantity) then
            hasSpace = false
            break
        end
    end
    if not hasSpace then
        lib.notify(src, {
            title = 'Error',
            description = 'Not enough space in inventory',
            type = 'error'
        })
        return
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
                print("[ERROR] Failed to give item: " .. item.id .. " to player: " .. src)
                lib.notify(src, {
                    title = 'Error',
                    description = 'Failed to give items, contact your server',
                    type = 'error',
                    duration = 15000
                })
            end
        else
            if not exports.ox_inventory:AddItem(src, item.id, item.quantity) then
                print("[ERROR] Failed to give item: " .. item.id .. " to player: " .. src)
                lib.notify(src, {
                    title = 'Error',
                    description = 'Failed to give items, contact your server',
                    type = 'error',
                    duration = 15000
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
