package com.codeWithMark.MASIDClothing.service.interf;

import com.codeWithMark.MASIDClothing.dto.AddressDto;
import com.codeWithMark.MASIDClothing.dto.Response;

public interface AddressService {
    Response saveAndUpdateAddress(AddressDto addressDto);

}
