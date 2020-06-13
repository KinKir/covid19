const fs = require('fs')
const assert = require('assert')

const data_folder = 'data/morocco-data'
const data_file = 'data.json'

// translations
let en2zh = JSON.parse(fs.readFileSync('data/map-translations/en2zh.json'))

let output_morocco = {
    ENGLISH: 'Morocco',
    confirmedCount: {},
    deadCount: {},
    curedCount: {}
}

const regions = [
    'Béni Mellal-Khénifra',
    'Casablanca-Settat',
    'Drâa-Tafilalet',
    'Dakhla-Oued Ed-Dahab',
    'Fès-Meknès',
    'Guelmim-Oued Noun',
    'Laâyoune-Sakia El Hamra',
    'Marrakesh-Safi',
    'Oriental',
    'Rabat-Salé-Kénitra',
    'Souss-Massa',
    'Tanger-Tetouan-Al Hoceima'
]

const data = JSON.parse(fs.readFileSync(`${data_folder}/${data_file}`))
Object.keys(data).forEach((regionId) => {
    const regionEnglish = regions[parseInt(regionId, 10) - 1]
    assert(regionEnglish != null, `Region ${regionId} does not exist!`)
    const region = en2zh[regionEnglish]
    assert(region != null, `${regionEnglish} does not exist!`)

    output_morocco[region] = {
        ENGLISH: regionEnglish,
        confirmedCount: {},
        curedCount: {},
        deadCount: {}
    }

    data[regionId].forEach((record) => {
        let date = record['x']
        date = `${date.slice(6, 10)}-${date.slice(0, 5)}`
        assert(!isNaN(new Date(date)), `Date ${date} is not valid!`)

        output_morocco[region]['confirmedCount'][date] = parseInt(record['y'], 10)
    })
})

fs.writeFileSync(`public/data/morocco.json`, JSON.stringify(output_morocco))

// modify map
// const mapName = 'gadm36_MAR_1'
// let map = JSON.parse(fs.readFileSync(`data/maps/${mapName}.json`))
// let geometries = map.objects[mapName].geometries
//
// geometries.forEach((geo) => {
//     let regionEnglish = geo.properties.NAME_1
//     const region = en2zh[regionEnglish]
//
//     geo.properties.NAME_1 = regionEnglish
//     geo.properties.CHINESE_NAME = region
//     assert(region != null, `${regionEnglish} does not exist!`)
//
//     if (region in output_morocco) {
//         geo.properties.REGION = `摩洛哥.${region}`
//     }
// })
//
// map.objects[mapName].geometries = geometries
// fs.writeFileSync(`public/maps/${mapName}.json`, JSON.stringify(map))
