fx_version "cerulean"

description "A good shop script based on ox_inventory's shop"
author "Snowy"
version '1.0.1'
repository 'https://github.com/SSnowly/snowy_shops'
lua54 'yes'

games {
  "gta5",
}

ui_page 'web/build/index.html'

client_scripts {
  "client/**/*",
  '@qbx_core/modules/playerdata.lua'
}
server_scripts {
  "server/**/*"
}
shared_scripts {
  "@ox_lib/init.lua",
  "config.lua"
}
files {
  'web/build/index.html',
  'web/build/**/*',
  'web/public/logo.png'
}