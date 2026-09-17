export function useSnackbar() {
  const snackbar = useState("snackbar", () => ({
    show: false,
    text: "",
    color: "success" as "success" | "error",
  }));

  function notify(text: string, color: "success" | "error" = "success") {
    snackbar.value = { show: true, text, color };
  }

  return { snackbar, notify };
}
