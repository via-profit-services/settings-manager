# Via Profit services / Settings-Manager

![via-profit-services-cover](./assets/via-profit-services-cover.png)

> Via Profit services / **Settings-Manager** - это пакет, который является частью сервиса, базирующегося на `via-profit-services` и представляет собой реализацию схемы для хранения каких-либо настроек, например, настроек ползователей.

## Содержание

- [Установка и настройка](#setup)
- [Как использовать](#how-to-use)
- [Подключение](#integration)

## <a name="setup"></a> Установка и настройка

### Установка

```bash
yarn add ssh://git@gitlab.com:via-profit-services/settings-manager.git#semver:^0.7.0
```


Список версий [см. здесь](https://gitlab.com/via-profit-services/settings-manager/-/tags)


### Миграции

После первой установки примените все необходимые миграции:

```bash
yarn knex:migrate:latest
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
 - service - Класс, реализующий модель данного модуля
 - makeSchema - Генератор типов и резолверов для пользовательскиъ настроек
 - TSettingsCategory - ENUM Интерфейс категорий настроек



Пример подключения:

```ts
import { App } from '@via-profit-services/core';
import * as settingsManager from '@via-profit-services/settings-manager';

const { TSettingsCategory, makeSchema,  } = settingsManager; 

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

const app = new App({
  ...
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
- [ ] Write the tests
- [ ] Create Subscriptions
