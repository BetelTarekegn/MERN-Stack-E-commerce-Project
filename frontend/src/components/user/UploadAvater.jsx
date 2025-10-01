import React, { useState } from 'react';
import UserLayout from '../layout/UserLayout';
import { useNavigate } from 'react-router-dom';
import { useUploadAvatarMutation } from '../../redux/api/userApi';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/features/userSlice';
import MetaData from "../layout/MetaData.jsx"

const UploadAvater = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || "/image/default_avator.jpg"
  );

  const navigate = useNavigate();
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Prepare the avatar data (base64 string)
    const userData = {
      avatar,
    };

    try {
      // Upload avatar, wait for response
      const response = await uploadAvatar(userData).unwrap();

      // Update Redux user state with new user data (including updated avatar)
      dispatch(setUser(response.user));

      // **Update local preview state to new avatar URL from response**
      setAvatarPreview(response.user.avatar.url);

      toast.success("Avatar Uploaded Successfully");

      // Navigate after short delay (optional)
      setTimeout(() => navigate("/me/profile"), 1000);

    } catch (error) {
      toast.error(error?.data?.message, "Upload failed");
    }
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);  // Show preview from base64 immediately
        setAvatar(reader.result);         // Save base64 string for upload
      }
    };

    reader.readAsDataURL(file);
  };



  return (
    <>
      <MetaData title={"Upload Avater"} />
      <UserLayout>
        <div className="row wrapper">
          <div className="col-10 col-lg-8">
            <form className="shadow rounded bg-body" onSubmit={submitHandler}>
              <h2 className="mb-4">Upload Avatar</h2>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <figure className="avatar item-rtl">
                      <img src={avatarPreview} className="rounded-circle" alt="avatar preview" />
                    </figure>
                  </div>
                  <div className="input-foam">
                    <label className="form-label" htmlFor="customFile">
                      Choose Avatar
                    </label>
                    <input
                      type="file"
                      name="avatar"
                      className="form-control"
                      id="customFile"
                      accept="image/*"
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>

              <button
                id="register_button"
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>
      </UserLayout>
    </>
  );
};

export default UploadAvater;