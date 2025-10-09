import { Link, Links } from "react-router-dom";
import zagasmLogo from "../../assets/zagasm_studio_logo.png";
export function Error404() {
  return (
   <div className="vh-100">
         <div className="container">
            <div className="row align-items-center vh-100">
               <div className="col-md-6">
				  <img src={zagasmLogo} alt="Zagasm Logo" style={{ width: '50px', height: '50px', }} />
                  <h1 style={{color:'#8000FF'}} className=" display-3 font-weight-light">Page not <span className="font-weight-bold">found</span></h1>
                  <p className="mb-0 lead">Oops! Looks like you followed a bad link.</p>
                  <p className="lead mb-5">If you think this is a problem with us, please <a href="#">tell us</a>.</p>
                  <Link to="/" style={{backgroundColor:'#8000FF', color:'white'}}  className="btn  btn-lg">Go Back</Link>
               </div>
             
            </div>
         </div>
      </div>
  );
}
