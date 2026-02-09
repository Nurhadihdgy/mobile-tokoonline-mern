export let navigationRef: any;

export const setNavigation = (ref: any) => {
  navigationRef = ref;
};

export const navigate = (name: string) => {
  navigationRef?.navigate(name);
};