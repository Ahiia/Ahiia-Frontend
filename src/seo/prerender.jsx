import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router-dom";
import Landing from "../landing/Landing.jsx";
import Home from "../landing/pages/Home.jsx";
import About from "../landing/pages/About.jsx";
import Contact from "../landing/pages/Contact.jsx";

export function render(path) {
  return renderToString(<StaticRouter location={path}><Routes><Route element={<Landing />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </Route></Routes></StaticRouter>);
}
