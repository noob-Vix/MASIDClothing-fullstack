package com.codeWithMark.MASIDClothing.service.impl;

import com.codeWithMark.MASIDClothing.dto.LoginRequest;
import com.codeWithMark.MASIDClothing.dto.Response;
import com.codeWithMark.MASIDClothing.dto.UserDto;
import com.codeWithMark.MASIDClothing.entity.User;
import com.codeWithMark.MASIDClothing.enums.UserRole;
import com.codeWithMark.MASIDClothing.exception.InvalidCredentialException;
import com.codeWithMark.MASIDClothing.exception.NotFoundException;
import com.codeWithMark.MASIDClothing.mapper.EntityDtoMapper;
import com.codeWithMark.MASIDClothing.repository.UserRepo;
import com.codeWithMark.MASIDClothing.security.JwtUtils;
import com.codeWithMark.MASIDClothing.service.CaptchaService;
import com.codeWithMark.MASIDClothing.service.interf.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EntityDtoMapper entityDtoMapper;
    private final CaptchaService captchaService;

    @Override
    public Response registerUser(UserDto registrationRequest) {
        UserRole role = UserRole.USER;
        if (registrationRequest.getRole() != null && registrationRequest.getRole().equalsIgnoreCase("admin")){
            role = UserRole.ADMIN;
        }
        User user =  User.builder()
                .name(registrationRequest.getName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .phoneNumber(registrationRequest.getPhoneNumber())
                .userRole(role)
                .build();

        User savedUser = userRepo.save(user);

        UserDto userDto = entityDtoMapper.userToDto(savedUser);
        return Response.builder()
                .status(200)
                .message("User successfully added")
                .user(userDto)
                .build();
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {
        User user = userRepo.findByEmail(loginRequest.getEmail()).orElseThrow(()->new NotFoundException("Email not found"));
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new InvalidCredentialException("Password  does not match");
        }
        if (!captchaService.verifyCaptcha(loginRequest.getCaptchaToken())) {
            throw new InvalidCredentialException("Invalid reCaptcha token  does not match");
        }
        String token = jwtUtils.generateToken(user);
        return Response
                .builder()
                .status(200)
                .message("User login successfully")
                .token(token)
                .captchaToken(loginRequest.getCaptchaToken())
                .expirationTime("expires in 6 months")
                .role(user.getUserRole().name())
                .build();
    }

    @Override
    public Response getAllUsers() {
        List<User> users = userRepo.findAll();
        List<UserDto> userDtos = users.stream()
                .map(entityDtoMapper::userToDto)
                .toList();
        return Response.builder()
                .status(200)
                .message("Successfully get all users")
                .userList(userDtos)
                .build();
    }

    @Override
    public User getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email= authentication.getName();
        log.info("User email is: "+ email);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public Response getUserInfoAndOrderHistory() {
        User user = getLoginUser();
        UserDto userDto = entityDtoMapper.userToDtoPlusAddressAndOrderHistory(user);
        return Response.builder()
                .status(200)
                .user(userDto)
                .build();
    }

    @Override
    public Response getUserInfo(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("User Not Found"));
        UserDto userDto = entityDtoMapper.userToDtoPlusAddressAndOrderHistory(user);
        return Response.builder()
                .status(200)
                .user(userDto)
                .build();
    }
}
