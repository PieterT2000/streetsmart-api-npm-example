import { StreetSmartApi, ViewerType, ApiOptions, AuthOptions, PanoramaViewer } from "@cyclomedia/streetsmart-api";

export default class CyclomediaApi {
  srsName = "EPSG:28992";
  imageSrs = "EPSG:28992";
  async initStreetApi(options: Partial<ApiOptions> & AuthOptions) {
    const apiOptions: ApiOptions =
    {
      targetElement: document.getElementById("panoramaViewerWindow"),
      apiKey: "demo",
      srs: this.srsName,
      locale: "en-US",
      addressSettings: {
        locale: 'nl',
        database: 'CMDatabase'
      },
      ...options
    }
    // eslint-disable-next-line no-undef
    return await StreetSmartApi.init(apiOptions)
      .then((res) => {
        console.log(res)
        return 'success'
      })
      .catch((e) => {
        console.error(e)
        return "error"
      });
  }

  async openLocation(coordinates: number[] | string, callback: (result: unknown) => void) {
    const promise = new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      StreetSmartApi.open(coordinates, {
        viewerType: ViewerType.PANORAMA,
        srs: this.imageSrs,
        panoramaViewer: {
          closable: true,
          maximizable: true,
          replace: true,
          recordingsVisible: true,
          navbarVisible: true,
          timeTravelVisible: true,
        },
      })
        .then((panoramaViewer) => {
          if (panoramaViewer && panoramaViewer[0]) {
            (panoramaViewer[0] as PanoramaViewer)
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
