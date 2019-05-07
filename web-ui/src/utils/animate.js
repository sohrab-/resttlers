export default (
  dom,
  animation,
  { infinite = false, delay = "", speed = "" } = {}
) => {
  const classes = ["animated", animation];
  if (infinite) {
    classes.push("infinite");
  }
  if (delay) {
    classes.push(`delay-${delay}`);
  }
  if (speed) {
    classes.push(speed);
  }

  dom.classList.add(...classes);

  function handleAnimationEnd() {
    dom.classList.remove(...classes);
    dom.removeEventListener("animationend", handleAnimationEnd);
  }
  dom.addEventListener("animationend", handleAnimationEnd);
};
