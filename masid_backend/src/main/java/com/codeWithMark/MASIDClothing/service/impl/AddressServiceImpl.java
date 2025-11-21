package com.codeWithMark.MASIDClothing.service.impl;

import com.codeWithMark.MASIDClothing.dto.AddressDto;
import com.codeWithMark.MASIDClothing.dto.Response;
import com.codeWithMark.MASIDClothing.entity.Address;
import com.codeWithMark.MASIDClothing.entity.User;
import com.codeWithMark.MASIDClothing.repository.AddressRepo;
import com.codeWithMark.MASIDClothing.service.interf.AddressService;
import com.codeWithMark.MASIDClothing.service.interf.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepo addressRepo;
    private final UserService userService;

    @Override
    public Response saveAndUpdateAddress(AddressDto addressDto) {
        User user =userService.getLoginUser();
        Address address = user.getAddress();

        if(address == null){
            address = new Address();
            address.setUser(user);

        }
        if (addressDto.getStreet() != null) address.setStreet(addressDto.getStreet());
        if (addressDto.getCity() != null) address.setCity(addressDto.getCity());
        if (addressDto.getState() != null) address.setState(addressDto.getState());
        if (addressDto.getCountry() != null) address.setCountry(addressDto.getCountry());
        if (addressDto.getZipCode() != null) address.setZipCode(addressDto.getZipCode());

        addressRepo.save(address);
        String message = (user.getAddress() == null) ?
                "Address successfully created" : "Address successfully updated";
        return Response.builder()
                .status(200)
                .message(message)
                .build();
    }
}
