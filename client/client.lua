local Config = require 'config'
local isShopOpen = false
local CurrentShopId = nil

local function formatItems(items)
    local itemReturn = {}
  for _, item in ipairs(items) do
        local itemData = exports.ox_inventory:Items(item.name)
        if not itemData or not itemData.name then return itemReturn end
        print(("Found Item %s"):format(itemData.name))
        itemReturn[#itemReturn+1] = {
          id = itemData.name,
          name = itemData.label,
          price = item.price,
          image = itemData.image or ("nui://ox_inventory/web/images/".. itemData.name ..".png"),
          category = item.category
        }
    end
    return itemReturn
end
local function toggleNuiFrame(shouldShow, data)
    SetNuiFocus(shouldShow, shouldShow)
    isShopOpen = shouldShow
    SendReactMessage('setVisible', shouldShow)
    if shouldShow then
        TriggerScreenblurFadeIn(0)
        SendReactMessage('setShopTitle', data.title)
        print(json.encode(data.items))
        local items = formatItems(data.items)
        SendReactMessage('setItems', json.encode(items))
        SendReactMessage('setCategories', json.encode(data.categories))
        
        SendReactMessage('setBalance', json.encode({
            cash = QBX.PlayerData.money.cash,
            bank = QBX.PlayerData.money.bank
        }))
    else
        TriggerScreenblurFadeOut(0)
    end
end


RegisterNUICallback('hideFrame', function(_, cb)
    toggleNuiFrame(false)
    CurrentShopId = nil
    cb({})
end)

RegisterNUICallback('showNotification', function(data, cb)
    lib.notify({
      title = data.title,
      description = data.description,
      type = data.type
    })
    cb({})
end)

RegisterNUICallback('closeNui', function(_, cb)
    toggleNuiFrame(false)
    CurrentShopId = nil
    cb({})
end)

RegisterNUICallback('purchaseItems', function(data, cb)
  print(json.encode(data))
    TriggerServerEvent('snowy_shops:server:purchaseItems', { items = data.items, shopId = CurrentShopId, paymentMethod = data.paymentType })
    
    cb({ success = true })
end)

RegisterCommand('shop', function()
    if not isShopOpen then
        toggleNuiFrame(true)
    end
end, false)

CreateThread(function()
  for shopId, shop in pairs(Config.Shops) do
    print("HELLO BITCH")
    for _, target in ipairs(shop.targets) do
      if shop.blip then
        local blip = AddBlipForCoord(target.loc)
        SetBlipSprite(blip, shop.blip.id)
        SetBlipColour(blip, shop.blip.colour)
        SetBlipScale(blip, shop.blip.scale)
        SetBlipAsShortRange(blip, true)
        BeginTextCommandSetBlipName("STRING")
        AddTextComponentString(shop.title)
        EndTextCommandSetBlipName(blip)
      end  
      exports.ox_target:addBoxZone({
        coords = target.loc,
        size = vec3(target.length, target.width, 0.5),
        rotation = target.heading,
        debug = false,
        distance = target.distance,
        options = {
          {
            name = "shop_" .. target.loc.x .. "_" .. target.loc.y .. "_" .. target.loc.z,
            label = "Shop",
            icon = "fa-solid fa-shop",
            onSelect = function()
              toggleNuiFrame(true, shop)
              CurrentShopId = shopId
            end
          }
        }
      })
    end
  end

end)