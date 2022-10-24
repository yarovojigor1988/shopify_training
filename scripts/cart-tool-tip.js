import React from "react"
import ReactDOM from "react-dom/client";
import { CartToolTip } from "./Components/CartToolTip"

const rootEl = ReactDOM.createRoot(document.getElementById("react-order-info"));

rootEl && rootEl.render(<CartToolTip />)
