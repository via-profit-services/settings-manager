# Via Profit services / Settings-Manager

![via-profit-services-cover](./assets/via-profit-services-cover.png)

> Via Profit services / **Settings-Manager** - это пакет, который является частью сервиса, базирующегося на `via-profit-services` и представляет собой реализацию схемы для хранения каких-либо настроек, например, настроек ползователей.

![npm (scoped)](https://img.shields.io/npm/v/@via-profit-services/settings-manager?color=blue)
![NPM](https://img.shields.io/npm/l/@via-profit-services/settings-manager?color=blue)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@via-profit-services/settings-manager?color=green)

## Содержание

- [Зависимости](#dependencies)
- [Установка и настройка](#setup)
- [Как использовать](#how-to-use)
- [Подключение](#integration)

## <a name="dependencies"></a> Зависимости

Модули, которые необходимо установить вручную

 - [Core](https://github.com/via-profit-services/core)


## <a name="setup"></a> Установка и настройка

Предполагается, что у вас уже установлен пакет [@via-profit-services/core](https://github.com/via-profit-services/core). Если нет, то перейдите на страницу проекта и установите модуль согласно документации.

### Установка

```bash
yarn add @via-profit-services/settings-manager
```

![npm (scoped)](https://img.shields.io/npm/v/@via-profit-services/settings-manager?color=blue)
![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@via-profit-services/settings-manager?color=red)


### Миграции

После первой установки примените все необходимые миграции:

```bash
yarn via-profit-core get-migrations -m ./src/database/migrations
yarn via-profit-core knex migrate latest --knexfile ./src/utils/knexfile.ts
```

После применения миграций будут созданы все необходимые таблицы в вашей базе данных


## <a name="how-to-use"></a> Как использовать


Каждое поле настроек имеет следующую структуру:
 - **group** - `String` Группа настроек. Произвольная строка без пробелов и спецсимволов. Каждая группа должна быть уникальна
 - **category** - `TSettingsCategory` Категория настроек. Категория - это заранее заготовленный список значений, смысл которого структурировать список настроек
 - **name** - `String` Непосредственное наименование параметра настроек, например, `themeName` (название темы оформления)
 - **owner** - `uuid` Владелец _необязательное поле)_. Данный параметр указывает на пренадлежность параметров настроек. Если `owner` не указан, значит запись используется как общие настройки. Если указан, то следует относить настройки к конкретному владельцу, на котрого указывает этот идентификатор
 - **value** - `json` Значение. В базе данных поле хранится в формате `jsonb`, что позволяет хранить значение настроек в любом виде: строка, булево, число, объект, массив.

При получении настроек, помимо описанных выше данных, будут возвращены:
- **id** - `uuid` Прямой идентификатор записи
- **createdAt** `Date` Дата создания записи
- **updatedAt** `Date` Дата обновления записи


После подключения и генерирования необходимых типов и резолверов, доступ к настройкам можут быть осуществлен по средствам `GraphQL`, например:

```graphql
query {
  settings(owner: "3fb5ed4c-06ee-4844-b1aa-c6ec39a6bbb5") {
    layout {
      ui {
        theme {
          value
        }
      }
    }
  }
}

```
В примере выше осуществляется запрос настроек для владельца с ID `3fb5ed4c-06ee-4844-b1aa-c6ec39a6bbb5`. Будет осуществлен поиск настроек по пути:
```
layout->ui->theme->3fb5ed4c-06ee-4844-b1aa-c6ec39a6bbb5
```
и 
```
layout->ui->theme
```
В случае, если настройки найдены по первому пути, то они будут возвращены. Если настроек не найдено, то осуществляется поиск настроек по второму пути (без владельца). Если такие настройки найдены, то они будут возвращены. Во всех остальных случаях, если настройки не найдены, то будет возвращен `null`.

Такая схема нахождения настроек позволяет разделить все параметры на глобальные _(настройки по умолчанию)_ и персональные, причем таким образом, что запись персональных настроек будет получена только в том, случае, если такая запись есть, а во всех остальных случаех будет получена запись, которая является общей для всех. Например, в системе может храниться запись с названием темы оформления приложения. Пусть этот параметр является параметром по умолчанию. (_т.е. без владельца_) В таком случае, всем пользователям будет всегда возвращаться именно это значение. Но как только в системе появляется такая же запись, но с указанием владельца, то именно для указанного влядельца будет возвращаться уже эта запись, а всем остальным пользователям - та, которая не имеет владельца.

Для того, чтобы настроеки по умолчанию были добавлены в базу данных, используйте миграйии. Это позволит откатить добавленные в базу данных записи при откате миграций:

_Пример файла миграций с настройками по умолчанию_

**Примечание:** Не генерируйте идентификаторы при помощи модуля `uuid`, так как в данном случае вы не сможете правильно выполнить откат миграции.

```ts
import { Knex } from '@via-profit-services/core';

const defaultSettings = [
  {
    id: '1e4cf387-ff68-4515-a8ca-04c9c0126f3a',
    group: 'layout',
    category: 'ui',
    name: 'theme',
    value: 'light',
    comment: 'Default interface theme',
  },
  {
    id: 'c4fe25eb-03ec-4d3c-917d-7b11012a86f4',
    group: 'layout',
    category: 'ui',
    name: 'locale',
    value: 'en',
    comment: 'Default interface locale name',
  },
];

export async function up(knex: Knex): Promise<any> {
  return knex('settings').insert(defaultSettings.map((settingsField) => ({
    ...settingsField,
    value: JSON.stringify(settingsField.value),
  })));
}


export async function down(knex: Knex): Promise<any> {
  const ids = defaultSettings.map((settingsField) => settingsField.id);

  return knex('settings').del().whereIn('id', ids);
}


```


### <a name="integration"></a> Подключение

Для интеграции модуля требуется задействовать типы и резолверы модуля, затем необходимо сгенерировать пользовательские типы и резолверы, которые будут обслуживать структуру пользовательских настроек.

Для того, чтобы сгенерировать пользовательскую схему и резолверы, следует использовать функцию `makeSchema`, поставляемую пакетом. Функция принимает объект следующего типа:

Псевдокод:
```ts
НазваниеГруппы: [ // массив настроек, входящих в эту группу (уникальное имя)
  ...
  {
    category: КатегорияНастроек, // Категория должна быть уникальна в своей группе
    name: ['НазваниеПараметра', 'НазваниеПараметра', ... , 'НазваниеПараметра'],
  },
  ...
]
```


Модуль экспортирует наружу:
 - typeDefs - служебные Типы
 - resolvers - Служеюные Резолверы
 - service `depricated` - Класс, реализующий модель данного модуля
 - Settings - Класс, реализующий модель данного модуля
 - makeSchema - Генератор типов и резолверов для пользовательскиъ настроек
 - TSettingsCategory - ENUM Интерфейс категорий настроек
 - configureSettingsLogger - Функция конфигурации логгера



Пример подключения:

```ts
import path from 'path';
import { App } from '@via-profit-services/core';
import * as settingsManager from '@via-profit-services/settings-manager';

const { TSettingsCategory, makeSchema, configureSettingsLogger } = settingsManager; 

// generate settings schema
const customSettings = makeSchema({
  layout: [
    {
      category: TSettingsCategory.ui,
      name: ['appThemeName'],
    },
    {
      category: TSettingsCategory.contact,
      name: ['adminEmailAddress'],
    },
  ],
  catalog: [
    {
      category: TSettingsCategory.currency,
      name: ['deliveryDefaultAmount'],
    },
  ],
});

// define log directory location
const logDir = path.resolve(__dirname, '../log');

const app = new App({
  ...
  logger: configureLogger({
    logDir,
    loggers: {
      settings: configureSettingsLogger({ logDir }),
    },
  }),
  typeDefs: [
    settingsManager.typeDefs, // settings required types
    customSettings.typeDefs, // generated types
  ],
  resolvers: [
    settingsManager.resolvers, // settings required resolvers
    customSettings.resolvers, // generated resolvers
  ],
  ...
});
app.bootstrap();

```

## TODO

- [ ] Write the CONTRIBUTING docs
- [ ] Examples
- [ ] Write the tests
- [ ] Create Subscriptions
