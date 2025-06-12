import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContainer from "../assets/AuthContainer";
import "./codeverification.css";


export function CodeVerification({
  handleSubmit,
  isLoading,
  message,
  handleChange,
  code,
}) {
  console.log(message);

  return (
    <>
      <span>
        <i className="fa fa-key"></i> Code Verification
      </span>
      <p>Enter the code sent to your email to continue with password reset</p>
      {message && (
        <div className={`alert alert-${message.type}`}>{message.message}</div>
      )}
      <form className="c-form" onSubmit={handleSubmit}>
        <div className="row merged10">
          <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
            <label htmlFor="code">Code</label>
            <input
              name="code"
              id="code"
              className="mb-2"
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={handleChange}
              style={{ height: "60px" }}
            />
          </div>

          <div className="col-lg-12 col-md-6 mt-2 mb-4">
            <input
              style={{
                background: "#FA6342",
                color: "white",
                cursor: "pointer",
              }}
              className="btn-block btn"
              disabled={isLoading}
              type="submit"
              value={isLoading ? "loading..." : "Submit"}
            />
          </div>

          <span className="text-center">
            Don't have an account?{" "}
            <Link className="we-account underline" to="/auth/signup" title="">
              Signup
            </Link>
          </span>
        </div>
      </form>
    </>
  );
}
