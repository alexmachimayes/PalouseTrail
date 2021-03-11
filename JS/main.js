

require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapGallery",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/ElevationProfile/ElevationProfileViewModel",
  "esri/widgets/ElevationProfile",
  "esri/widgets/Expand",
  "esri/widgets/Fullscreen",
  "esri/widgets/LayerList",
  "esri/widgets/Locate",
    "esri/Graphic",
      "esri/tasks/RouteTask",
      "esri/tasks/support/RouteParameters",
      "esri/tasks/support/FeatureSet",
//    "esri/symbols/PictureMarkerSymbol",
//          "esri/Graphic",
          "esri/renderers/SimpleRenderer",
    "esri/PopupTemplate",
      "esri/popup/content/CustomContent",
 
], function (
  esriConfig,
  Map,
  MapView,
  BasemapGallery,
  FeatureLayer,
  Legend,
  ElevationProfileViewModel,
  ElevationProfile,
  Expand,
  Fullscreen,
  LayerList,
  Locate,
   Graphic, RouteTask, RouteParameters, FeatureSet,
   SimpleRenderer,
   PopupTemplate,
   CustomContent
//   Graphic,
//   PictureMarkerSymbol
  
) {
  esriConfig.apiKey =
    "AAPKc63a89c5fae34e48b8437e6316377e7cTG2pgapurznqWaLYrfzYmTgvXTsEYln2CVSBZsjYedazllEiy5WFyNeL6c9ZyqMg";

  const map = new Map({
    basemap: "topo-vector",
    ground: "world-elevation",
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-118.80543, 47.027],
    zoom: 8,
  });

    
 ////////////////////////////////////////////////////////////////////////////////// 
    
    
  var elevationProfile = new ElevationProfile({
    view: view,
//    container: document.createElement("div"),
      
    profiles: [
      {
        type: "ground", // autocasts as new ElevationProfileLineGround(),
        color: "blue", // display this profile in green
          hoveredPoint: "red",
        title: "World elevation", // with a custom label
          
      },
    ],
    unit: "imperial",
    visibleElements: {
      selectButton: true,
    },
      
  
      
  });
//    view.ui.add(elevationProfile, "bottom-left");
    
    var expandElevationProfile = new Expand({
        expandIconClass: "esri-icon-expand",
    view: view,
    content: elevationProfile
  });
        view.ui.add(expandElevationProfile, "bottom-left");
    
//   Mobile

//  var expandElevationProfile = new Expand({
//    view: view,
//      expandIconClass: "esri-icon-expand",
//    content: new ElevationProfile({
//      view: view,
//      container: document.createElement("div"),
//    }),
//  });  
//    view.ui.add(expandElevationProfile, "bottom-left");
    
    
    
//     
    
//    var elevationProfileExpand = new Expand({
//          view: view,
//          content: elevationProfile
//        });
//
//        // close the expand whenever a basemap is selected
//        elevationProfile.watch("activeProfile", function() {
//          var mobileSize = view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall";
//
//          if (mobileSize) {
//            elevationProfileExpand.collapse();
//          }
//        });
// //Add the expand instance to the ui
//
//        view.ui.add(elevationProfileExpand, "bottom-left");
    
  
    
//////////////////////////////////////////////////////////////////////////////////

  fullscreen = new Fullscreen({
    view: view,
  });
  view.ui.add(fullscreen, "top-left");
    
   

  /////////////////////////////////////////////////////////////////////////////////////

  const locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      options.target.scale = 1500;
      return view.goTo(options.target);
    },
  });
  view.ui.add(locate, "top-left");

  /////////////////////////////////////////////////////////////////////////////////////

  var layerList = new LayerList({
    view: view,
  });
  // Adds widget below other elements in the top left corner of the view
  view.ui.add(layerList, {
    position: "top-right",
  });
  layerList.selectionEnabled = true;
  layerList.multipleSelectionEnabled = true;

  var expandLayerList = new Expand({
    view: view,
    content: new LayerList({
      view: view,
      container: document.createElement("div"),
    }),
  });

  /////////////////////////////////////////////////////////////////////////////////////

  var legend = new Legend({
    view: view,
    container: document.createElement("div"),
  });

  // Mobile

  var expandLegend = new Expand({
    view: view,
    content: new Legend({
      view: view,
      container: document.createElement("div"),
    }),
  });

  /////////////////////////////////////////////////////////////////////////////////////

  const basemapGallery = new BasemapGallery({
    view: view,
    source: {
      query: {
        title: '"World Basemaps for Developers" AND owner:esri',
      },
    },
  });

  view.ui.add(basemapGallery, {
    position: "top-left",
//    width: 50,
  }); // Add to the view

  var expandBasemap = new Expand({
    view: view,
    content: new BasemapGallery({
      view: view,
      container: document.createElement("div"),
    }),
  });
//    var basemapGallery = new BasemapGallery({
//          view: view,
//          container: document.createElement("div")
//        });
//
//        // Create an Expand instance and set the content
//        // property to the DOM node of the basemap gallery widget
//        // Use an Esri icon font to represent the content inside
//        // of the Expand widget
//
//        var bgExpand = new Expand({
//          view: view,
//          content: basemapGallery
//        });
//
//        // close the expand whenever a basemap is selected
//        basemapGallery.watch("activeBasemap", function() {
//          var mobileSize = view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall";
//
//          if (mobileSize) {
//            bgExpand.collapse();
//          }
//        });
//
//        // Add the expand instance to the ui
//
//        view.ui.add(bgExpand, "top-right");
     
    

  function updateView(isMobile) {
    setTitleMobile(isMobile);
    setLegendMobile(isMobile);
    setLayerListMobile(isMobile);
    setBasemapMobile(isMobile);
//    setElevationProfile(isMobile);
  }

  // Load

  isResponsiveSize = view.widthBreakpoint === "small";
  updateView(isResponsiveSize);

  // Breakpoints

  view.watch("widthBreakpoint", function (breakpoint) {
    switch (breakpoint) {
      case "xsmall":
        updateView(true);
        break;
      case "small":
      case "medium":
      case "large":
        updateView(true);
        break;
      case "xlarge":
        updateView(true);
        break;
      default:
    }
  });

  function setTitleMobile(isMobile) {
    if (isMobile) {
      document.querySelector("#titleDiv").classList.add("invisible");
      view.padding = {
        top: 0,
      };
    } else {
      document.querySelector("#titleDiv").classList.remove("invisible");
      view.padding = {
        top: 55,
      };
    }
  }

  function setLegendMobile(isMobile) {
    var toAdd = isMobile ? expandLegend : legend;
    var toRemove = isMobile ? legend : expandLegend;
    view.ui.remove(toRemove);
    view.ui.add(toAdd, "top-right");
  }

  function setBasemapMobile(isMobile) {
    var toAdd = isMobile ? expandBasemap : basemapGallery;
    var toRemove = isMobile ? basemapGallery : expandBasemap;
    view.ui.remove(toRemove);
    view.ui.add(toAdd, "top-left");
  }

  function setLayerListMobile(isMobile) {
    var toAdd = isMobile ? expandLayerList : layerList;
    var toRemove = isMobile ? layerList : expandLayerList;
    view.ui.remove(toRemove);
    view.ui.add(toAdd, "top-right");
  }

//    function setElevationProfile(isMobile) {
//    var toAdd = isMobile ? expandElevationProfile : elevationProfile;
//    var toRemove = isMobile ? elevationProfile : expandElevationProfile;
//    view.ui.remove(toRemove);
//    view.ui.add(toAdd, "bottom-left");
//  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  


  //Trails feature layer (lines)

  const trailsRenderer_singleLine = {
    type: "simple",
    symbol: {
      color: "black",
      type: "simple-line",
      style: "solid",
      width: 1,
    },
  };

  const trailsLayer_singleLine = new FeatureLayer({
    url:
      "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Main_Trail/FeatureServer",
    renderer: trailsRenderer_singleLine,
    opacity: 0.75,
  });

  map.add(trailsLayer_singleLine, 0);
    
    
    
    
//    const trailsRenderer_original = {
//    type: "simple",
//    symbol: {
//      color: "green",
//      type: "simple-line",
//      style: "solid",
//      width: 1,
//    },
//  };
    
    
    
    const popupTrailsLayer_surfaces = {
    title: "Trail Surfaces",
    content:
      "<b>Info:</b> {Name}<br>",
  };
    
    const trailsLayer_surfaces = new FeatureLayer({
    url:
      "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Trail_Surfaces/FeatureServer",
//    renderer: trailsRenderer_original,
    opacity: 0.75,
        outFields: ["Name",],
    popupTemplate: popupTrailsLayer_surfaces,
  });
  map.add(trailsLayer_surfaces);
    
  
    
       const poiLayerRenderer =      {
  type: "unique-value",  // autocasts as new UniqueValueRenderer()
  field: "Category",
//  defaultSymbol: { type: "picture-marker" },  // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: [{
    // All features with value of "North" will be blue
   

      value: "Point of Interest",
    symbol: {
      type: "picture-marker",  // autocasts as new SimpleFillSymbol()
      url: "../../assets/images/star-3.png",
      width: 22,
      height: 25
    }
},   
                     
 {
      value: "Other",
    symbol: {
      type: "picture-marker",  // autocasts as new SimpleFillSymbol()
      url: "../../assets/images/sight-2.png",
      width: 22,
      height: 25
    }
},     
                     
{
      value: "Drinking Water",
    symbol: {
      type: "picture-marker",  // autocasts as new SimpleFillSymbol()
      url: "../../assets/images/waterdrop.png",
      width: 22,
      height: 25
    }
},
                     
{
      value: "Parking",
    symbol: {
      type: "picture-marker",  // autocasts as new SimpleFillSymbol()
      url: "../../assets/images/parking.png",
      width: 22,
      height: 25
    }
},  
                     
{ 
       value: "Camping",
    symbol: {
      type: "picture-marker",  // autocasts as new SimpleFillSymbol()
      url: "../../assets/images/wildderness_camping.png",
      width: 22,
      height: 25
    }
},
                     
                                  
                     
{
      value: "Bridge/Tunnel",
    symbol: {
      type: "picture-marker",  // autocasts as new SimpleFillSymbol()
      url: "../../assets/images/bridge_old.png",
      width: 22,
      height: 25
    }
},                        

{
      value: "Hazard",
    symbol: {
      type: "picture-marker",  // autocasts as new SimpleFillSymbol()
      url: "../../assets/images/caution.png",
      width: 22,
      height: 25
    }
},
                          
{
      value: "Trail Gap",
    symbol: {
      type: "picture-marker",  // autocasts as new SimpleFillSymbol()
      url: "../../assets/images/construction.png",
      width: 22,
      height: 25
    }
},                        
    ], 
};
    
  //Trailheads feature layer (points)
        // Define a pop-up for Trailheads
  const popupPoiLayer = {
    title: "POI",
    content:
      "<b>Category:</b> {Category}<br>  <b>Feature:</b> {Feature}<br>  <b>Info:</b> {Info}<br>  <b>Website:</b> {URL}<br>",
  };
    
  const poiLayer = new FeatureLayer({
    url:
      "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Points_of_Interest/FeatureServer",
    outFields: ["Category", "Feature", "Info", "URL"],
    popupTemplate: popupPoiLayer,
              renderer: poiLayerRenderer,
  });
  map.add(poiLayer);
    
    ////////////////////////////////////////////////////////////////////////////////////
    

//      const routeTask = new RouteTask({
//          
//        url: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
//    });
//    
//    view.on("click", function(event){
// if (view.graphics.length === 0) {
//        addGraphic("origin", event.mapPoint);
//      } else if (view.graphics.length === 1) {
//        addGraphic("destination", event.mapPoint);
//          
//          getRoute(); // Call the route service
//
//      } else {
//        view.graphics.removeAll();
//        addGraphic("origin",event.mapPoint);
//      }
//    });
//    
//    function addGraphic(type, point) {
//      const graphic = new Graphic({
//        symbol: {
//          type: "simple-marker",
//          color: (type === "origin") ? "white" : "black",
//          size: "8px"
//        },
//      geometry: point
//    });
//      view.graphics.add(graphic);
//    }
//    
//function getRoute() {
//      const routeParams = new RouteParameters({
//        stops: new FeatureSet({
//          features: view.graphics.toArray()
//        }),
//returnDirections: true
//      });
//
//    routeTask.solve(routeParams)
//        .then(function(data) {
//          data.routeResults.forEach(function(result) {
//            result.route.symbol = {
//              type: "simple-line",
//              color: [5, 150, 255],
//              width: 3
//            };
//            view.graphics.add(result.route);
//          });
//        
//        // Display directions
//         if (data.routeResults.length > 0) {
//           const directions = document.createElement("ol");
//          directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
//          directions.style.marginTop = "0";
//          directions.style.padding = "15px 15px 15px 30px";
//          const features = data.routeResults[0].directions.features;
//
//             // Show each direction
//          features.forEach(function(result,i){
//            const direction = document.createElement("li");
//            direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
//            directions.appendChild(direction);
//          });
//             
//             view.ui.empty("top-right");
//          view.ui.add(directions, "top-right");
//    }
//  
//         
//         
//         
//})
//    
//    .catch(function(error){
//            console.log(error);
//        })
//}
});



