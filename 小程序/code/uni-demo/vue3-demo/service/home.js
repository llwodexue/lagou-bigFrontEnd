import MYReuquest from "./index.js";

export const getBanner = () => {
  return MYReuquest.get("/banner", {});
};
