import { FormEvent, MouseEvent, useEffect, useState } from "react";
import CyclomediaApi from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import "./app.css";

const api = new CyclomediaApi();

function App() {
  const [initted, setInitted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return () => {
      setInitted(false);
      api.destroy();
    };
  }, []);

  const handleOpenViewer = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await api.openLocation([5.31982596963644, 50.9162282095559], () =>
      console.log("opened")
    );
  };

  const handleInit = async (evt: FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    const formData = new FormData(evt.target as HTMLFormElement);

    if (
      formData.get("username") === null ||
      formData.get("password") === null ||
      formData.get("apiKey") === null
    )
      return;

    const res = await api.initStreetApi({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      apiKey: formData.get("apiKey") as string,
    });
    if (res === "success") setInitted(true);
    else {
      (evt.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <div className="controls p-[20px]">
        <form className="w-[300px] space-y-6" onSubmit={handleInit}>
          <Input type="text" name="username" placeholder="Username" required />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Input type="text" name="apiKey" placeholder="ApiKey" required />
          <div className="space-x-3">
            <Button disabled={initted} type="submit">
              {loading ? <Loader2 className="animate-spin" /> : null}
              Init API
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
