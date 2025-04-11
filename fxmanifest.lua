fx_version "cerulean"

description "Basic React (TypeScript) & Lua Game Scripts Boilerplate"
author "Project Error"
version '1.0.0'
repository 'https://github.com/project-error/fivem-react-boilerplate-lua'

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/build/index.html'

client_scripts {
  "client/**/*"
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