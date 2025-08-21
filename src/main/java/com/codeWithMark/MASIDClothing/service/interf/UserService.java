package com.codeWithMark.MASIDClothing.service.interf;

import com.codeWithMark.MASIDClothing.dto.LoginRequest;
import com.codeWithMark.MASIDClothing.dto.Response;
import com.codeWithMark.MASIDClothing.dto.UserDto;
import com.codeWithMark.MASIDClothing.entity.User;

public interface UserService {
    Response registerUser(UserDto registrationRequest);

    Response loginUser(LoginRequest loginRequest);

    Response getAllUsers();

    User getLoginUser();

    Response getUserInfoAndOrderHistory();
}
