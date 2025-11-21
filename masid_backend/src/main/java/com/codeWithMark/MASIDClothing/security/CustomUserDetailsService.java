package com.codeWithMark.MASIDClothing.security;


import com.codeWithMark.MASIDClothing.entity.User;
import com.codeWithMark.MASIDClothing.exception.NotFoundException;
import com.codeWithMark.MASIDClothing.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new NotFoundException("User email not found"));
        return AuthUser.builder()
                .user(user)
                .build();
    }
}
