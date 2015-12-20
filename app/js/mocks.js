/**
 * Mocked response for http://mytrip244611.azurewebsites.net/api/trip
 * @type {*[]}
 */
mockedTripsResponse = [
    {
        Id: 1,
        Date: "2015-12-20T11:52:07.9001799+00:00",
        IsPublic: false,
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
        IsPublic: false,
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
        Id: 3,
        Date: "2015-12-20T11:52:07.9001799+00:00",
        IsPublic: false,
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
        Id: 4,
        Date: "2015-12-20T11:52:07.9001799+00:00",
        IsPublic: false,
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
        Id: 5,
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

/**
 *
 * @type {*[]}
 */
mockedPhotos = [
    {
        id: 1,
        status: "Formatted",
        thumbnailUrl: "http://static5.artspan.com/member/painterfish2/125/262510.jpg",//ta z listy fot przy wycieczce
        bigThumbnailUrl: "http://static5.artspan.com/member/painterfish2/125/262510.jpg",//added - ta z widoku trips, moze nie potrzebnie
        defaultBigThumbnail: true,//added
        url: "https://lh3.ggpht.com/684ypp5HcslSrFwwa4giJ9IrtTdwUmDTyaqKJJon_l2hJUwkac13_m8FHRamOqj6bzU=h310",
        tripId: 1
    },
    {
        id: 2,
        status: "Formatted",
        thumbnailUrl: "http://static5.artspan.com/member/painterfish2/125/262510.jpg",
        bigThumbnailUrl: "http://static5.artspan.com/member/painterfish2/125/262510.jpg",//added
        defaultBigThumbnail: true,//added
        url: "https://lh3.ggpht.com/684ypp5HcslSrFwwa4giJ9IrtTdwUmDTyaqKJJon_l2hJUwkac13_m8FHRamOqj6bzU=h310",
        tripId: 2
    }
]