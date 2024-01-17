import { FormEvent, MouseEvent, useEffect, useState } from "react";
import CyclomediaApi from "@/lib/api";
import { ApiOptions, AuthOptions } from "@cyclomedia/streetsmart-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import "./app.css";
import { CheckedState } from "@radix-ui/react-checkbox";

const api = new CyclomediaApi();

function App() {
  const [initted, setInitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthEnabled, setOauthEnabled] = useState<CheckedState>(false);

  useEffect(() => {
    return () => {
      console.log("destroy");
      setInitted(false);
      api.destroy(!!oauthEnabled);
    };
  }, []);

  const handleOpenViewer = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await api.openLocation("5D4KX5SM", (res) =>
      console.log("viewer opened", res)
    );
  };

  const handleLogin = async (evt: FormEvent) => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);

    setLoading(true);

    let options: Partial<ApiOptions> & AuthOptions;
    if (oauthEnabled) {
      options = {
        loginOauth: true,
        clientId: "DAC6C8E5-77AB-4F04-AFA5-D2A94DE6713F",
        loginRedirectUri: window.location.href + "login.html",
        logoutRedirectUri: window.location.href + "logout.html",
        apiKey: formData.get("apiKey") as string,
      };
    } else {
      if (
        formData.get("username") === null ||
        formData.get("password") === null ||
        formData.get("apiKey") === null
      ) {
        return;
      }

      options = {
        loginOauth: false,
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        apiKey: formData.get("apiKey") as string,
      };
    }

    const res = await api.initStreetApi(options);
    if (res === "success") setInitted(true);
    else {
      (evt.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <div className="controls p-[20px]">
        <form className="w-[300px] space-y-6" onSubmit={handleLogin}>
          <Input
            disabled={!!oauthEnabled}
            type="text"
            name="username"
            placeholder="Username"
            required
          />
          <Input
            disabled={!!oauthEnabled}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Input type="text" name="apiKey" placeholder="ApiKey" required />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="oauthCheck"
              value={String(oauthEnabled)}
              onCheckedChange={(checked) => setOauthEnabled(checked)}
            />
            <label
              htmlFor="oauthCheck"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Login using oAuth
            </label>
          </div>
          <div className="space-x-3 flex">
            <Button disabled={initted} type="submit">
              {loading ? <Loader2 className="animate-spin" /> : null}
              Login
            </Button>
            <Button
              className="inline-block"
              variant={"secondary"}
              onClick={handleOpenViewer}
              disabled={!initted}
            >
              Open viewer
            </Button>
          </div>
        </form>
      </div>
      <div id="panoramaViewerWindow" className="panorama-holder flex-1" />
    </div>
  );
}

export default App;
