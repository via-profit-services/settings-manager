/*!
 * 
 *  Via Profit Services / Settings Manager
 * 
 *  Repository https://gitlab.com/via-profit-services/settings-manager
 *  Contact    promo@via-profit.ru
 *  Website    https://via-profit.ru
 *       
 */
module.exports=function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){e.exports=require("@via-profit-services/core")},function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(o,r){function a(e){try{d(i.next(e))}catch(e){r(e)}}function s(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}d((i=i.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),a=o(n(8));class s{constructor(e){this.props=e}getSettings(e){return i(this,void 0,void 0,(function*(){const{context:t}=this.props,{knex:n}=t,{limit:i,offset:o,orderBy:a,where:s,search:d}=e;return yield n.select(["*"]).from("settings").limit(i||1).offset(o||0).where(e=>r.convertWhereToKnex(e,s)).where(e=>(d&&d.forEach(({field:t,query:n})=>{n.split(" ").map(n=>e.orWhereRaw(`"${t}"::text ${r.TWhereAction.ILIKE} '%${n}%'`))}),e)).orderBy(r.convertOrderByToKnex(a))}))}getSettingsByIds(e){return i(this,void 0,void 0,(function*(){return yield this.getSettings({where:[["id",r.TWhereAction.IN,e]],offset:0,limit:e.length})}))}static DataToPseudoId(e){const{group:t,category:n,name:i,owner:o}=e;return[t,n,i,o].join("|")}static getDataFromPseudoId(e){const[t,n,i,o]=e.split("|");return{group:t,category:n,name:i,owner:o}}getSettingsByPseudoIds(e){return i(this,void 0,void 0,(function*(){const{knex:t}=this.props.context;return yield t.select(["*"]).from("settings").limit(1e3).where(t=>(e.forEach(e=>{const n=s.getDataFromPseudoId(e);t.orWhere(e=>{e.where("category",r.TWhereAction.EQ,n.category),e.where("group",r.TWhereAction.EQ,n.group),e.where("name",r.TWhereAction.EQ,n.name),e.andWhere(e=>{n.owner?e.where("owner",r.TWhereAction.EQ,n.owner).orWhereNull("owner"):e.whereNull("owner")})})}),t))}))}updateSettings(e,t){return i(this,void 0,void 0,(function*(){const{knex:n,timezone:i}=this.props.context,o=Object.assign(Object.assign({},t),{id:e,value:r.convertJsonToKnex(n,t.value),updatedAt:a.default.tz(i).format()}),[s]=yield n("settings").update(o).where("id",e).returning("id");return s}))}createSettings(e){return i(this,void 0,void 0,(function*(){const{knex:t,timezone:n}=this.props.context,i=Object.assign(Object.assign({},e),{value:r.convertJsonToKnex(t,e.value),createdAt:a.default.tz(n).format(),updatedAt:a.default.tz(n).format()}),[o]=yield t("settings").insert(i).returning("id");return o}))}deleteSettings(e){return i(this,void 0,void 0,(function*(){const{knex:t}=this.props.context,[n]=yield t("settings").del().where({id:e}).returning("id");return n}))}}t.SettingsService=s,t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(3))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}(n(4))},function(e,t,n){"use strict";function i(e){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t};Object.defineProperty(t,"__esModule",{value:!0});const a=o(n(5));t.resolvers=a.default;const s=r(n(9));t.typeDefs=s;const d=o(n(1));t.service=d.default,i(n(10)),i(n(14)),i(n(15))},function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(o,r){function a(e){try{d(i.next(e))}catch(e){r(e)}}function s(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}d((i=i.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),a=n(6),s=o(n(7)),d=o(n(1)),u={Query:{settings:(e,t)=>i(void 0,void 0,void 0,(function*(){return t}))},Mutation:{settings:()=>({})},SettingsCollection:{common:()=>({})},SettingsCommonGroup:{contact:()=>({})},SettingsCommonFields:{developer:()=>"Via Profit"},SettingsValue:new Proxy({id:()=>({}),value:()=>({}),createdAt:()=>({}),updatedAt:()=>({}),owner:()=>({}),group:()=>({}),category:()=>({})},{get:(e,t)=>(e,n,o)=>i(void 0,void 0,void 0,(function*(){const n=d.default.DataToPseudoId(e),i=s.default(o),a=yield i.settings.load(n);if(void 0===a){const{logger:t}=o;throw t.settings.error("Attempt to get a nonexistent field with pseudoId "+n,{parent:e}),new r.BadRequestError("Settings of this params not exists",{parent:e})}return void 0===a[t]?null:a[t]}))}),SettingsMutation:{set:(e,t,n)=>i(void 0,void 0,void 0,(function*(){const{token:e,logger:i}=n,{id:o,group:u,category:l,name:c,owner:g,value:p}=t,m=d.default.DataToPseudoId(t);s.default(n).settings.clear(m);const f=new d.default({context:n}),[y]=yield f.getSettings({limit:1,where:[["group",r.TWhereAction.EQ,u],["category",r.TWhereAction.EQ,l],["name",r.TWhereAction.EQ,c],["owner",g?r.TWhereAction.EQ:r.TWhereAction.NULL,g]]}),v=`${u}->${l}->${c}->owner:${g||"none"}`;if(y)try{yield f.updateSettings(y.id,{value:p}),y.owner?i.settings.info(`Account ${e.uuid} updated personal settings ${v} to set «${JSON.stringify(p)}»`,{settingsID:y.id}):i.settings.info(`Account ${e.uuid} updated global settings ${v} to set ${JSON.stringify(p)}`,{settingsID:y.id});const[t]=yield f.getSettingsByIds([y.id]);return t}catch(e){throw new r.ServerError("Failed to update settings with id "+y.id,{err:e})}else try{const n={id:o||a.v4(),group:u,category:l,name:c,owner:g||null,value:p};return yield f.createSettings(n),n.owner?i.settings.info(`Account ${e.uuid} created new personal settings ${v} to set «${JSON.stringify(p)}»`,{settingsID:n.id}):i.settings.info(`Account ${e.uuid} created new global settings ${v} to set ${JSON.stringify(p)}`,{settingsID:n.id}),t}catch(e){throw new r.ServerError("Failed to create settings",{err:e})}})),delete:(e,t,n)=>i(void 0,void 0,void 0,(function*(){const{id:e}=t,{token:i,logger:o}=n,a=new d.default({context:n}),[u]=yield a.getSettingsByIds([e]),l=`${u.group}->${u.category}->${u.name}->owner:${u.owner||"none"}`,c=s.default(n),g=d.default.DataToPseudoId(u);c.settings.clear(g);try{yield a.deleteSettings(e)}catch(t){throw new r.ServerError(`Failed to delete settings ${l} with id ${e}`,{err:t})}return u.owner?o.settings.info(`Account ${i.uuid} deleted personal settings ${l}`,{settingsID:u.id}):o.settings.info(`Account ${i.uuid} deleted global settings ${l}`,{settingsID:u.id}),!0}))}};t.default=u},function(e,t){e.exports=require("uuid")},function(e,t,n){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=n(0),r=i(n(1)),a={settings:null};t.default=function(e){if(null!==a.settings)return a;const t=new r.default({context:e});return a.settings=new o.DataLoader(e=>t.getSettingsByPseudoIds(e).then(t=>e.map(e=>{const{category:n,group:i,name:o,owner:a}=r.default.getDataFromPseudoId(e),s=t.filter(e=>e.category===n&&e.group===i&&e.name===o);return s.find(e=>e.owner===a)||s[0]}))),a}},function(e,t){e.exports=require("moment-timezone")},function(e,t){var n={kind:"Document",definitions:[{kind:"ObjectTypeExtension",name:{kind:"Name",value:"Query"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",description:{kind:"StringValue",value:"Returns any setting",block:!0},name:{kind:"Name",value:"settings"},arguments:[{kind:"InputValueDefinition",description:{kind:"StringValue",value:"If this property was set then settings will be returns only for this owner ID",block:!0},name:{kind:"Name",value:"owner"},type:{kind:"NamedType",name:{kind:"Name",value:"ID"}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCollection"}}},directives:[]}]},{kind:"ObjectTypeExtension",name:{kind:"Name",value:"Mutation"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"settings"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsMutation"}}},directives:[]}]},{kind:"ObjectTypeDefinition",name:{kind:"Name",value:"SettingsMutation"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",description:{kind:"StringValue",value:"Set single settings field",block:!0},name:{kind:"Name",value:"set"},arguments:[{kind:"InputValueDefinition",description:{kind:"StringValue",value:"You may provide custom ID of this record",block:!0},name:{kind:"Name",value:"id"},type:{kind:"NamedType",name:{kind:"Name",value:"ID"}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"Settings geoup name",block:!0},name:{kind:"Name",value:"group"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"Settings category",block:!0},name:{kind:"Name",value:"category"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCategory"}}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"Settings field name",block:!0},name:{kind:"Name",value:"name"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"Settings value",block:!0},name:{kind:"Name",value:"value"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"JSON"}}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"If this property was set then settings will be updated only for this owner ID",block:!0},name:{kind:"Name",value:"owner"},type:{kind:"NamedType",name:{kind:"Name",value:"ID"}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsValue"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"delete"},arguments:[{kind:"InputValueDefinition",name:{kind:"Name",value:"id"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ID"}}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},directives:[]}]},{kind:"EnumTypeDefinition",description:{kind:"StringValue",value:"Category of the settings",block:!0},name:{kind:"Name",value:"SettingsCategory"},directives:[],values:[{kind:"EnumValueDefinition",name:{kind:"Name",value:"general"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"ui"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"contact"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"constraint"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"currency"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"size"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"label"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"other"},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Settings collection.",block:!0},name:{kind:"Name",value:"SettingsCollection"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"common"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCommonGroup"}}},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Group of settings fields",block:!0},name:{kind:"Name",value:"SettingsCommonGroup"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"contact"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCommonFields"}}},directives:[]}]},{kind:"ObjectTypeDefinition",name:{kind:"Name",value:"SettingsCommonFields"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"developer"},arguments:[],type:{kind:"NamedType",name:{kind:"Name",value:"SettingsValue"}},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Settings results bag",block:!0},name:{kind:"Name",value:"SettingsValue"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"id"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ID"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Creation date of this settings field",block:!0},name:{kind:"Name",value:"createdAt"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"DateTime"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Updated date of this settings field",block:!0},name:{kind:"Name",value:"updatedAt"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"DateTime"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"The presence of this parameter determines whether the parameter is shared by all or personal to this owner",block:!0},name:{kind:"Name",value:"owner"},arguments:[],type:{kind:"NamedType",name:{kind:"Name",value:"ID"}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Settings group name",block:!0},name:{kind:"Name",value:"group"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"category"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCategory"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Settings value",block:!0},name:{kind:"Name",value:"value"},arguments:[],type:{kind:"NamedType",name:{kind:"Name",value:"JSON"}},directives:[]}]}],loc:{start:0,end:1661}};n.loc.source={body:'extend type Query {\n\n  """\n  Returns any setting\n  """\n  settings(\n    """\n    If this property was set then settings will be returns only for this owner ID\n    """\n    owner: ID\n  ): SettingsCollection!\n}\n\nextend type Mutation {\n  settings: SettingsMutation!\n}\n\ntype SettingsMutation {\n\n  """\n  Set single settings field\n  """\n  set(\n    """\n    You may provide custom ID of this record\n    """\n    id: ID\n    """\n    Settings geoup name\n    """\n    group: String!\n\n    """\n    Settings category\n    """\n    category: SettingsCategory!\n\n    """\n    Settings field name\n    """\n    name: String!\n\n    """\n    Settings value\n    """\n    value: JSON!\n\n    """\n    If this property was set then settings will be updated only for this owner ID\n    """\n    owner: ID\n    ): SettingsValue!\n\n  delete(id: ID!): Boolean!\n}\n\n"""\nCategory of the settings\n"""\nenum SettingsCategory {\n  general\n  ui\n  contact\n  constraint\n  currency\n  size\n  label\n  other\n}\n\n"""\nSettings collection.\n"""\ntype SettingsCollection {\n  common: SettingsCommonGroup!\n}\n\n"""\nGroup of settings fields\n"""\ntype SettingsCommonGroup {\n  contact: SettingsCommonFields!\n}\n\ntype SettingsCommonFields {\n  developer: SettingsValue\n}\n\n"""\nSettings results bag\n"""\ntype SettingsValue {\n  id: ID!\n\n  """\n  Creation date of this settings field\n  """\n  createdAt: DateTime!\n\n  """\n  Updated date of this settings field\n  """\n  updatedAt: DateTime!\n\n  """\n  The presence of this parameter determines whether the parameter is shared by all or personal to this owner\n  """\n  owner: ID\n\n  """\n  Settings group name\n  """\n  group: String!\n  category: SettingsCategory!\n\n  """\n  Settings value\n  """\n  value: JSON\n}',name:"GraphQL request",locationOffset:{line:1,column:1}};e.exports=n},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(11);n(12);const o=n(13),r=i.format.combine(i.format.metadata(),i.format.json(),i.format.timestamp({format:"YYYY-MM-DDTHH:mm:ssZZ"}),i.format.splat(),i.format.printf(e=>{const{timestamp:t,level:n,message:i,metadata:o}=e,r="{}"!==JSON.stringify(o)?o:null;return`${t} ${n}: ${i} ${r?JSON.stringify(r):""}`}));t.configureSettingsLogger=e=>{const{logDir:t,logFilenamePattern:n}=e,a=n||o.LOG_FILENAME_SETTINGS;return i.createLogger({level:"debug",format:r,transports:[new i.transports.DailyRotateFile({filename:`${t}/${a}`,level:"info",datePattern:o.LOG_DATE_PATTERNT,zippedArchive:!0,maxSize:o.LOG_MAZ_SIZE,maxFiles:o.LOG_MAZ_FILES}),new i.transports.DailyRotateFile({filename:`${t}/${o.LOG_FILENAME_ERRORS}`,level:"error",datePattern:o.LOG_DATE_PATTERNT,zippedArchive:!0,maxSize:o.LOG_MAZ_SIZE,maxFiles:o.LOG_MAZ_FILES}),new i.transports.DailyRotateFile({filename:`${t}/${o.LOG_FILENAME_DEBUG}`,level:"debug",datePattern:o.LOG_DATE_PATTERNT,zippedArchive:!0,maxSize:o.LOG_MAZ_SIZE,maxFiles:o.LOG_MAZ_FILES})]})},t.default=t.configureSettingsLogger},function(e,t){e.exports=require("winston")},function(e,t){e.exports=require("winston-daily-rotate-file")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(0);t.LOG_MAZ_FILES=i.LOG_MAZ_FILES,t.LOG_MAZ_SIZE=i.LOG_MAZ_SIZE,t.LOG_DATE_PATTERNT=i.LOG_DATE_PATTERNT,t.LOG_FILENAME_DEBUG=i.LOG_FILENAME_DEBUG,t.LOG_FILENAME_ERRORS=i.LOG_FILENAME_ERRORS,t.LOG_FILENAME_SETTINGS="settings-%DATE%.log"},function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(o,r){function a(e){try{d(i.next(e))}catch(e){r(e)}}function s(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}d((i=i.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.makeSchema=e=>{const t=[],n={};return Object.entries(e).forEach(([e,n])=>{const i=e.charAt(0).toUpperCase()+e.slice(1),o=[];n.forEach(({category:e})=>{o.includes(e)||o.push(e)}),o.forEach(e=>{const o=e.charAt(0).toUpperCase()+e.slice(1),r=n.filter(t=>t.category===e);t.push(`\n        """\n        Type of «${i}» group for «${o}» category\n        This type was generated automatically\n        """\n        type Settings${i}${o}Fields {\n      `),r.forEach(({name:e})=>{(Array.isArray(e)?e:[e]).forEach(e=>{t.push(`\n            """\n            «${e}» options of «${i}» group for «${o}» category\n            This type was generated automatically\n            """\n            ${e}: SettingsValue!\n          `)})}),t.push("\n        }\n      ")}),t.push(`\n      extend type SettingsCollection {\n        ${e}: Settings${i}Group!\n      }\n    `),o.forEach((e,n)=>{const r=e.charAt(0).toUpperCase()+e.slice(1);0===n&&t.push(`\n          """\n          «${i}» settings group\n          Note: this type was generated automatically\n          """\n          type Settings${i}Group {\n        `),t.push(`\n        ${e}: Settings${i}${r}Fields!\n      `),n===o.length-1&&t.push("\n        }")})}),Object.entries(e).forEach(([e,t])=>{const o=e.charAt(0).toUpperCase()+e.slice(1),r=[];t.forEach(({category:e})=>{r.includes(e)||r.push(e)}),n.SettingsCollection=n.SettingsCollection||{},n.SettingsCollection[e]=t=>Object.assign(Object.assign({},t),{group:e}),n[`Settings${o}Group`]={},r.forEach(e=>{const r=t.filter(t=>t.category===e);n[`Settings${o}Group`][e]=t=>i(void 0,void 0,void 0,(function*(){return Object.assign(Object.assign({},t),{category:e})}));const a={};r.forEach(({name:e})=>{(Array.isArray(e)?e:[e]).forEach(e=>{a[e]=t=>i(void 0,void 0,void 0,(function*(){const{owner:n}=t;return Object.assign(Object.assign({},t),{owner:n,name:e})}))})});const s=e.charAt(0).toUpperCase()+e.slice(1);n[`Settings${o}${s}Fields`]=a})}),{typeDefs:t.join("\n"),resolvers:n}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.general="general",e.ui="ui",e.contact="contact",e.constraint="constraint",e.currency="currency",e.size="size",e.label="label",e.other="other"}(t.TSettingsCategory||(t.TSettingsCategory={}))}]);