import { useEffect, useState } from "react";
import { merge } from "lodash";
import { create, StoreApi, UseBoundStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AppearanceSlice, createAppearanceSlice } from "./appearance";
import { AuthenticationSlice, createAuthenticationSlice } from "./authentication";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { state: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>;
  store.state = {};
  for (let k of Object.keys(store.getState())) {
    (store.state as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export type AppStoreType = AppearanceSlice & AuthenticationSlice;

const useAppStore = createSelectors(
  create<AppStoreType>()(
    persist(
      (...a) => ({
        ...createAppearanceSlice(...a),
        ...createAuthenticationSlice(...a)
      }),
      {
        name: "pingu.Storage-CC3CA466-D017-4F26-AE1C-48FD376DBDF6",
        storage: createJSONStorage(() => localStorage),
        // zustand persist - actions inside nested object are undefined on rehydration
        // fix: https://github.com/pmndrs/zustand/issues/457
        merge: (persistedState, currentState) => {
          return merge({}, currentState, persistedState);
        }
      }
    )
  )
);

export const useAppearance = useAppStore.state.appearance;

export const useAuthentication = useAppStore.state.authentication;

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useAppStore.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => setHydrated(true));

    setHydrated(useAppStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
