import StreetSmartApi from "@pietert/streetsmart-api";

export default class CyclomediaApi {
  typeName = "atlas:Recording";
  apiUrl = "https://atlasapi.cyclomedia.com/api/recording/wfs";
  srsName = "EPSG:4326";
  imageSrs = "EPSG:3857";
  configurationUrl = "https://atlas.cyclomedia.com/configuration";
  panoramaConfig = {
    defaultView: "PANORAMA",
  };

  viewerType = this.panoramaConfig.defaultView;
  async initStreetApi(auth: { username: string; password: string; apiKey: string }) {
    // eslint-disable-next-line no-undef
    return await StreetSmartApi.init.call(this, {
      targetElement: document.getElementById("panoramaViewerWindow"),
      ...auth,
      srs: this.srsName,
      locale: "en-us",
      configurationUrl: this.configurationUrl,
      staticBaseUrl: "https://streetsmart.cyclomedia.com/api/v23.11/",
      addressSettings: {
        locale: "us",
        database: "Nokia",
      },
    })
      .then(() => "success")
      .catch((e) => {
        console.error(e)
        return "error"
      });
  }

  async openLocation(coordinates: number[], callback: (result: unknown) => void) {
    const promise = new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      StreetSmartApi.open(coordinates, {
        viewerType: this.viewerType,
        srs: this.imageSrs,
        panoramaViewer: {
          closable: true,
          maximizable: true,
          replace: true,
          recordingsVisible: true,
          navbarVisible: true,
          timeTravelVisible: true,
          // measureTypeButtonVisible: false,
          // measureTypeButtonStart: false,
          // measureTypeButtonToggle: false,
        },
      })
        .then((panoramaViewer) => {
          if (panoramaViewer && panoramaViewer[0]) {
            return resolve(panoramaViewer[0]);
          }
        })
        .catch((reason) => reject(reason));
    });

    return promise.then((result) => callback(result));
  }

  destroy() {
    const options = {
      targetElement: document.getElementById("panoramaViewerWindow"),
      loginOauth: false,
    };

    // eslint-disable-next-line no-undef
    return StreetSmartApi.destroy(options);
  }
}
