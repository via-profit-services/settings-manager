/*!
 * 
 *  Via Profit Services / Settings Manager
 * 
 *  Repository https://gitlab.com/via-profit-services/settings-manager
 *  Contact    promo@via-profit.ru
 *  Website    https://via-profit.ru
 *       
 */
module.exports=function(e){var n={};function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:i})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(i,r,function(n){return e[n]}.bind(null,r));return i},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=2)}([function(e,n){e.exports=require("@via-profit-services/core")},function(e,n,t){"use strict";var i=this&&this.__awaiter||function(e,n,t,i){return new(t||(t=Promise))((function(r,o){function a(e){try{u(i.next(e))}catch(e){o(e)}}function s(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(a,s)}u((i=i.apply(e,n||[])).next())}))},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const o=t(0),a=r(t(9));n.REDIS_HASHNAME="viaprofitservices",n.REDIS_FIELDNAME="settings";class s{constructor(e){this.props=e}getSettings(e){return i(this,void 0,void 0,(function*(){const{context:n}=this.props,{knex:t}=n,{limit:i,offset:r,orderBy:a,where:s,search:u}=e;return u&&s.push([u.field,o.TWhereAction.ILIKE,`%${u.query}%`]),yield t.select(["*"]).from("settings").limit(i||1).offset(r||0).where(e=>o.convertWhereToKnex(e,s)).orderBy(o.convertOrderByToKnex(a))}))}getSettingsByIds(e){return i(this,void 0,void 0,(function*(){return yield this.getSettings({where:[["id",o.TWhereAction.IN,e]],offset:0,limit:e.length})}))}updateSettings(e,n){return i(this,void 0,void 0,(function*(){const{knex:t,timezone:i}=this.props.context,r=Object.assign(Object.assign({},n),{id:e,value:o.convertJsonToKnex(t,n.value),updatedAt:a.default.tz(i).format()}),[s]=yield t("settings").update(r).where("id",e).returning("id");return s}))}createSettings(e){return i(this,void 0,void 0,(function*(){const{knex:n,timezone:t}=this.props.context,i=Object.assign(Object.assign({},e),{value:o.convertJsonToKnex(n,e.value),createdAt:a.default.tz(t).format(),updatedAt:a.default.tz(t).format()}),[r]=yield n("settings").insert(i).returning("id");return r}))}deleteSettings(e){return i(this,void 0,void 0,(function*(){const{knex:n}=this.props.context,[t]=yield n("settings").del().where({id:e}).returning("id");return t}))}}n.SettingsService=s,n.default=s},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}(t(3))},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}(t(4))},function(e,n,t){"use strict";function i(e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])}var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n.default=e,n};Object.defineProperty(n,"__esModule",{value:!0});const a=r(t(5));n.permissions=a.default;const s=r(t(7));n.resolvers=s.default;const u=o(t(10));n.typeDefs=u;const l=r(t(1));n.service=l.default,i(t(11)),i(t(15)),i(t(16))},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const i=t(6);n.permissions=i.shield({}),n.default=n.permissions},function(e,n){e.exports=require("graphql-shield")},function(e,n,t){"use strict";var i=this&&this.__awaiter||function(e,n,t,i){return new(t||(t=Promise))((function(r,o){function a(e){try{u(i.next(e))}catch(e){o(e)}}function s(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(a,s)}u((i=i.apply(e,n||[])).next())}))},r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n.default=e,n};Object.defineProperty(n,"__esModule",{value:!0});const o=t(0),a=t(8),s=r(t(1)),u={Query:{settings:(e,n,t)=>i(void 0,void 0,void 0,(function*(){const{redis:e}=t;if(null===(yield e.hget(s.REDIS_HASHNAME,s.REDIS_FIELDNAME))){const n=new s.default({context:t}),i=yield n.getSettings({limit:1e3});yield e.hset(s.REDIS_HASHNAME,s.REDIS_FIELDNAME,JSON.stringify(i))}return n}))},Mutation:{settings:()=>({})},SettingsCollection:{common:()=>({})},SettingsCommonGroup:{contact:()=>({})},SettingsCommonFields:{developer:()=>"Via Profit"},SettingsValue:new Proxy({id:()=>({}),value:()=>({}),createdAt:()=>({}),updatedAt:()=>({}),owner:()=>({}),group:()=>({}),category:()=>({})},{get:(e,n)=>e=>e[n]||null}),SettingsMutation:{set:(e,n,t)=>i(void 0,void 0,void 0,(function*(){const{redis:e,token:i,logger:r}=t,{group:u,category:l,name:d,owner:c,value:p}=n,m=new s.default({context:t});yield e.hdel(s.REDIS_HASHNAME,s.REDIS_FIELDNAME);const[g]=yield m.getSettings({limit:1,where:[["group",o.TWhereAction.EQ,u],["category",o.TWhereAction.EQ,l],["name",o.TWhereAction.EQ,d],["owner",c?o.TWhereAction.EQ:o.TWhereAction.NULL,c]]}),f=`${u}->${l}->${d}->owner:${c||"none"}`;if(g)try{yield m.updateSettings(g.id,{value:p}),g.owner?r.settings.info(`Account ${i.uuid} updated personal settings ${f} to set «${JSON.stringify(p)}»`,{settingsID:g.id}):r.settings.info(`Account ${i.uuid} updated global settings ${f} to set ${JSON.stringify(p)}`,{settingsID:g.id});const[e]=yield m.getSettingsByIds([g.id]);return e}catch(e){throw new o.ServerError("Failed to update settings with id "+g.id,{err:e})}else try{const e={id:a.v4(),group:u,category:l,name:d,owner:c||null,value:p};yield m.createSettings(e),e.owner?r.settings.info(`Account ${i.uuid} created new personal settings ${f} to set «${JSON.stringify(p)}»`,{settingsID:e.id}):r.settings.info(`Account ${i.uuid} created new global settings ${f} to set ${JSON.stringify(p)}`,{settingsID:e.id});const[n]=yield m.getSettingsByIds([e.id]);return n}catch(e){throw new o.ServerError("Failed to create settings",{err:e})}}))}};n.default=u},function(e,n){e.exports=require("uuid")},function(e,n){e.exports=require("moment-timezone")},function(e,n){var t={kind:"Document",definitions:[{kind:"ObjectTypeExtension",name:{kind:"Name",value:"Query"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",description:{kind:"StringValue",value:"Returns any setting",block:!0},name:{kind:"Name",value:"settings"},arguments:[{kind:"InputValueDefinition",description:{kind:"StringValue",value:"If this property was set then settings will be returns only for this owner ID",block:!0},name:{kind:"Name",value:"owner"},type:{kind:"NamedType",name:{kind:"Name",value:"ID"}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCollection"}}},directives:[]}]},{kind:"ObjectTypeExtension",name:{kind:"Name",value:"Mutation"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"settings"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsMutation"}}},directives:[]}]},{kind:"ObjectTypeDefinition",name:{kind:"Name",value:"SettingsMutation"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",description:{kind:"StringValue",value:"Set single settings field",block:!0},name:{kind:"Name",value:"set"},arguments:[{kind:"InputValueDefinition",description:{kind:"StringValue",value:"Settings geoup name",block:!0},name:{kind:"Name",value:"group"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"Settings category",block:!0},name:{kind:"Name",value:"category"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCategory"}}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"Settings field name",block:!0},name:{kind:"Name",value:"name"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"Settings value",block:!0},name:{kind:"Name",value:"value"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"JSON"}}},directives:[]},{kind:"InputValueDefinition",description:{kind:"StringValue",value:"If this property was set then settings will be updated only for this owner ID",block:!0},name:{kind:"Name",value:"owner"},type:{kind:"NamedType",name:{kind:"Name",value:"ID"}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsValue"}}},directives:[]}]},{kind:"EnumTypeDefinition",description:{kind:"StringValue",value:"Category of the settings",block:!0},name:{kind:"Name",value:"SettingsCategory"},directives:[],values:[{kind:"EnumValueDefinition",name:{kind:"Name",value:"general"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"ui"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"contact"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"constraint"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"currency"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"size"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"label"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"other"},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Settings collection.",block:!0},name:{kind:"Name",value:"SettingsCollection"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"common"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCommonGroup"}}},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Group of settings fields",block:!0},name:{kind:"Name",value:"SettingsCommonGroup"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"contact"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCommonFields"}}},directives:[]}]},{kind:"ObjectTypeDefinition",name:{kind:"Name",value:"SettingsCommonFields"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"developer"},arguments:[],type:{kind:"NamedType",name:{kind:"Name",value:"SettingsValue"}},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Settings results bag",block:!0},name:{kind:"Name",value:"SettingsValue"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"id"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ID"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Creation date of this settings field",block:!0},name:{kind:"Name",value:"createdAt"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"DateTime"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Updated date of this settings field",block:!0},name:{kind:"Name",value:"updatedAt"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"DateTime"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"The presence of this parameter determines whether the parameter is shared by all or personal to this owner",block:!0},name:{kind:"Name",value:"owner"},arguments:[],type:{kind:"NamedType",name:{kind:"Name",value:"ID"}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Settings group name",block:!0},name:{kind:"Name",value:"group"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"category"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SettingsCategory"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Settings value",block:!0},name:{kind:"Name",value:"value"},arguments:[],type:{kind:"NamedType",name:{kind:"Name",value:"JSON"}},directives:[]}]}],loc:{start:0,end:1560}};t.loc.source={body:'extend type Query {\n\n  """\n  Returns any setting\n  """\n  settings(\n    """\n    If this property was set then settings will be returns only for this owner ID\n    """\n    owner: ID\n  ): SettingsCollection!\n}\n\nextend type Mutation {\n  settings: SettingsMutation!\n}\n\ntype SettingsMutation {\n\n  """\n  Set single settings field\n  """\n  set(\n    """\n    Settings geoup name\n    """\n    group: String!\n\n    """\n    Settings category\n    """\n    category: SettingsCategory!\n\n    """\n    Settings field name\n    """\n    name: String!\n\n    """\n    Settings value\n    """\n    value: JSON!\n\n    """\n    If this property was set then settings will be updated only for this owner ID\n    """\n    owner: ID\n    ): SettingsValue!\n}\n\n"""\nCategory of the settings\n"""\nenum SettingsCategory {\n  general\n  ui\n  contact\n  constraint\n  currency\n  size\n  label\n  other\n}\n\n"""\nSettings collection.\n"""\ntype SettingsCollection {\n  common: SettingsCommonGroup!\n}\n\n"""\nGroup of settings fields\n"""\ntype SettingsCommonGroup {\n  contact: SettingsCommonFields!\n}\n\ntype SettingsCommonFields {\n  developer: SettingsValue\n}\n\n"""\nSettings results bag\n"""\ntype SettingsValue {\n  id: ID!\n\n  """\n  Creation date of this settings field\n  """\n  createdAt: DateTime!\n\n  """\n  Updated date of this settings field\n  """\n  updatedAt: DateTime!\n\n  """\n  The presence of this parameter determines whether the parameter is shared by all or personal to this owner\n  """\n  owner: ID\n\n  """\n  Settings group name\n  """\n  group: String!\n  category: SettingsCategory!\n\n  """\n  Settings value\n  """\n  value: JSON\n}',name:"GraphQL request",locationOffset:{line:1,column:1}};e.exports=t},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const i=t(12);t(13);const r=t(14),o=i.format.combine(i.format.metadata(),i.format.json(),i.format.timestamp({format:"YYYY-MM-DDTHH:mm:ssZZ"}),i.format.splat(),i.format.printf(e=>{const{timestamp:n,level:t,message:i,metadata:r}=e,o="{}"!==JSON.stringify(r)?r:null;return`${n} ${t}: ${i} ${o?JSON.stringify(o):""}`}));n.configureSettingsLogger=e=>{const{logDir:n,logFilenamePattern:t}=e,a=t||r.LOG_FILENAME_SETTINGS;return i.createLogger({level:"debug",format:o,transports:[new i.transports.DailyRotateFile({filename:`${n}/${a}`,level:"info",datePattern:r.LOG_DATE_PATTERNT,zippedArchive:!0,maxSize:r.LOG_MAZ_SIZE,maxFiles:r.LOG_MAZ_FILES}),new i.transports.DailyRotateFile({filename:`${n}/${r.LOG_FILENAME_ERRORS}`,level:"error",datePattern:r.LOG_DATE_PATTERNT,zippedArchive:!0,maxSize:r.LOG_MAZ_SIZE,maxFiles:r.LOG_MAZ_FILES}),new i.transports.DailyRotateFile({filename:`${n}/${r.LOG_FILENAME_DEBUG}`,level:"debug",datePattern:r.LOG_DATE_PATTERNT,zippedArchive:!0,maxSize:r.LOG_MAZ_SIZE,maxFiles:r.LOG_MAZ_FILES})]})},n.default=n.configureSettingsLogger},function(e,n){e.exports=require("winston")},function(e,n){e.exports=require("winston-daily-rotate-file")},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const i=t(0);n.LOG_MAZ_FILES=i.LOG_MAZ_FILES,n.LOG_MAZ_SIZE=i.LOG_MAZ_SIZE,n.LOG_DATE_PATTERNT=i.LOG_DATE_PATTERNT,n.LOG_FILENAME_DEBUG=i.LOG_FILENAME_DEBUG,n.LOG_FILENAME_ERRORS=i.LOG_FILENAME_ERRORS,n.LOG_FILENAME_SETTINGS="settings-%DATE%.log"},function(e,n,t){"use strict";var i=this&&this.__awaiter||function(e,n,t,i){return new(t||(t=Promise))((function(r,o){function a(e){try{u(i.next(e))}catch(e){o(e)}}function s(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(a,s)}u((i=i.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0});const r=t(0),o=t(1);n.makeSchema=e=>{const n=[],t={};return Object.entries(e).forEach(([e,t])=>{const i=e.charAt(0).toUpperCase()+e.slice(1),r=[];t.forEach(({category:e})=>{r.includes(e)||r.push(e)}),r.forEach(e=>{const r=e.charAt(0).toUpperCase()+e.slice(1),o=t.filter(n=>n.category===e);n.push(`\n        """\n        Type of «${i}» group for «${r}» category\n        This type was generated automatically\n        """\n        type Settings${i}${r}Fields {\n      `),o.forEach(({name:e})=>{(Array.isArray(e)?e:[e]).forEach(e=>{n.push(`\n            """\n            «${e}» options of «${i}» group for «${r}» category\n            This type was generated automatically\n            """\n            ${e}: SettingsValue!\n          `)})}),n.push("\n        }\n      ")}),n.push(`\n      extend type SettingsCollection {\n        ${e}: Settings${i}Group!\n      }\n    `),r.forEach((e,t)=>{const o=e.charAt(0).toUpperCase()+e.slice(1);0===t&&n.push(`\n          """\n          «${i}» settings group\n          Note: this type was generated automatically\n          """\n          type Settings${i}Group {\n        `),n.push(`\n        ${e}: Settings${i}${o}Fields!\n      `),t===r.length-1&&n.push("\n        }")})}),Object.entries(e).forEach(([e,n])=>{const a=e.charAt(0).toUpperCase()+e.slice(1),s=[];n.forEach(({category:e})=>{s.includes(e)||s.push(e)}),t.SettingsCollection=t.SettingsCollection||{},t.SettingsCollection[e]=e=>e,t[`Settings${a}Group`]={},s.forEach(s=>{const u=n.filter(e=>e.category===s);t[`Settings${a}Group`][s]=e=>i(void 0,void 0,void 0,(function*(){return e}));const l={};u.forEach(({name:n})=>{(Array.isArray(n)?n:[n]).forEach(n=>{l[n]=(t,a,u)=>i(void 0,void 0,void 0,(function*(){const{owner:i}=t,{redis:a}=u,l=yield a.hget(o.REDIS_HASHNAME,o.REDIS_FIELDNAME);let d=[];try{d=JSON.parse(l)}catch(e){throw new r.ServerError("Failed to read settings",{err:e})}try{const[t]=d.filter(t=>t.group===e&&t.category===s&&t.name===n&&null===t.owner),[r]=d.filter(t=>t.group===e&&t.category===s&&t.name===n&&t.owner===(i||null));return r||t||null}catch(t){throw new r.ServerError(`Failed to get settings for current query «${e}»->${s}»->«${n}»->«${i||"without owner"}»`,{err:t})}}))})});const d=s.charAt(0).toUpperCase()+s.slice(1);t[`Settings${a}${d}Fields`]=l})}),{typeDefs:n.join("\n"),resolvers:t}}},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){e.general="general",e.ui="ui",e.contact="contact",e.constraint="constraint",e.currency="currency",e.size="size",e.label="label",e.other="other"}(n.TSettingsCategory||(n.TSettingsCategory={}))}]);