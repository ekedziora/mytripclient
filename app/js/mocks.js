/**
 * Mocked response for http://mytrip244611.azurewebsites.net/api/trip
 * @type {*[]}
 */
mockedTripsResponse = [
    { Id: 1, Name: "Super trasa", Owner: "You", Description: "Blaaa blaa taaaka traasaaa..", IsPublic: false },
    { Id: 2, Name: "Fajna", Owner: "You", Description: "dada dada daa..", IsPublic: false },
    { Id: 3, Name: "Wow", Owner: "You", Description: "Bdad dggg saaka traasaaa..", IsPublic: false },
    { Id: 4, Name: "Drogaaa", Owner: "You", Description: "Blffffaf ..", IsPublic: false },
    { Id: 5, Name: "Nibylandia", Owner: "You", Description: "Bfa yyj f gf g gs sdfd fsa..", IsPublic: false },
    { Id: 6, Name: "Wycieczka szkolna", Owner: "You", Description: "Blaaa bladaaaaaaaaaddad dad sd sdas  dassaaa..", IsPublic: false },
    { Id: 7, Name: "Wyprawa do Mordoru", Owner: "You", Description: "Bldddadasddd nnhmccas ccasc csac", IsPublic: false },
    { Id: 8, Name: "W Azkabanie", Owner: "You", Description: "Blaaadsd ddww aasaaa..", IsPublic: false },
    { Id: 9, Name: "Na koniec úwiata", Owner: "You", Description: "Bladda traad saaa..", IsPublic: false }
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
                longitude: 22,
                city: "Zbuczyn"
            },
            {
                id: 2,
                latitude: 52.7,
                longitude: 22.7,
                city: "Chromna"
            },
            {
                id: 3,
                latitude: 52.8,
                longitude: 22.2,
                city: "Inowroc≈Çaw"
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