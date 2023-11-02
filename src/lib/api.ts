import StreetSmartApi, { ApiOptions } from "@cyclomedia/streetsmart-api";

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
  async initStreetApi(options: Pick<ApiOptions, 'apiKey' | 'loginRedirectUri' | 'loginOauth' | 'logoutRedirectUri' | 'clientId'> | Pick<ApiOptions, 'apiKey' | 'username' | 'password'>) {
    // eslint-disable-next-line no-undef
    return await StreetSmartApi.init({
      targetElement: document.getElementById("panoramaViewerWindow"),
      ...options,
      srs: this.srsName,
      locale: "en-us",
      configurationUrl: this.configurationUrl,
      addressSettings: {
        locale: 'nl',
        database: 'CMDatabase'
      }
    })
      .then(() => "success")
      .catch((e) => {
        console.error(e)
        return "error"
      });
  }

  async openLocation(coordinates: number[] | string, callback: (result: unknown) => void) {
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

  destroy(loginOauth: boolean) {
    const options = {
      targetElement: document.getElementById("panoramaViewerWindow"),
      loginOauth,
    };

    // eslint-disable-next-line no-undef
    return StreetSmartApi.destroy(options);
  }
}
