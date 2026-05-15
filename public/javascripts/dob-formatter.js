document.addEventListener("DOMContentLoaded", () => {
  const dobInput = document.getElementById("dob");
  if (!dobInput) return;

  let lastValue = dobInput.value || "";

  dobInput.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "");
    if (this.value.length < lastValue.length) {
      lastValue = this.value;
      return;
    }
    let finalValue = "";
    if (v.length > 0) {
      finalValue = v.slice(0, 2);
      if (v.length > 2) {
        finalValue += "/" + v.slice(2, 4);
        if (v.length > 4) {
          finalValue += "/" + v.slice(4, 8);
        }
      }
    }
    this.value = finalValue;
    lastValue = finalValue;
  });
});
