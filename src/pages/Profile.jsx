import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const [changeDetails, setChangeDetails] = useState(false);

  const navigate = useNavigate();

  // const [loggedIn, setLoggedIn] = useState(false);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setFormData({
  //          name: auth.currentUser.displayName,
  //          email: auth.currentUser.email,
  //        });
  //     }
  //   });
  // }, []);

  const { name, email } = formData;

  const handleSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });

        toast.success("Profile details updated successfully");
      }
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <section className="max-w-6xl">
      <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
      <div className="w-full md:w-[50%] mt-6 px-3 mx-auto">
        <form>
          <input
            type="text"
            id="name"
            value={name}
            className={
              "mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" +
              (changeDetails && " border-2 border-blue-500")
            }
            disabled={!changeDetails}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            id="email"
            defaultValue={email}
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
          />

          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
            <p className="flex items-center">
              Do you want to change your name?
              <span
                className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                onClick={() => {
                  setChangeDetails((prevChangeDetails) => !prevChangeDetails);
                  changeDetails && handleSubmit();
                }}
              >
                {changeDetails ? "Apply Changes" : "Edit"}
              </span>
            </p>
            <p
              className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              onClick={handleLogout}
            >
              Sign out
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
