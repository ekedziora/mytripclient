/**
 * Mocked response for http://mytrip244611.azurewebsites.net/api/trip
 * @type {*[]}
 */
mockedTripsResponse = [
    {
        Id: 1,
        Date: "2015-12-20T11:52:07.9001799+00:00",
        IsPublic: true,
        route: {
            id: 1,
            points: [
                {
                    id: 1,
                    latitude: 52.5,
                    longitude: 22
                },
                {
                    id: 2,
                    latitude: 52.7,
                    longitude: 22.7
                }
            ]
        }
    },
    {
        Id: 2,
        Date: "2015-12-20T11:52:07.9001799+00:00",
        IsPublic: true,
        route: {
            id: 1,
            points: [
                {
                    id: 1,
                    latitude: 52.5,
                    longitude: 22
                },
                {
                    id: 2,
                    latitude: 52.7,
                    longitude: 22.7
                }
            ]
        }
    }
];

/**
 * Mocked response for ?
 * @type {*[]}
 */
mockedTripResponse =
{
    Id: 1,
    Date: "2015-12-20T11:52:07.9001799+00:00",
    IsPublic: true,
    route: {
        id: 1,
        points: [
            {
                id: 1,
                latitude: 52.5,
                longitude: 22
            },
            {
                id: 2,
                latitude: 52.7,
                longitude: 22.7
            }
        ]
    }
}
;

/**
 *
 * @type {*[]}
 */
mockedPictures = [
    {name: "obrazek", thumbnail: ""},
    {name: "drugi obrazek"},
    {name: "foteczka"}
];

/**
 *
 * @type {*[]}
 */
mockedWaypoints = [
    {name: "Radom"}
];