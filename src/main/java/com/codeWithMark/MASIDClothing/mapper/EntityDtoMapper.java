package com.codeWithMark.MASIDClothing.mapper;

import com.codeWithMark.MASIDClothing.dto.*;
import com.codeWithMark.MASIDClothing.entity.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    //user entity to dto
    public UserDto userToDto(User user){
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setName(user.getName());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setRole(user.getUserRole().name());

        return userDto;
    }

    //address entity to dto
    public AddressDto addressToDto(Address address){
        AddressDto addressDto = new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setCity(address.getCity());
        addressDto.setState(address.getState());
        addressDto.setStreet(address.getStreet());
        addressDto.setCountry(address.getCountry());
        addressDto.setZipCode(address.getZipCode());
        return addressDto;
    }

    public CategoryDto categoryToDto(Category category){
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        return categoryDto;
    }

    public OrderItemDto orderItemToDto(OrderItem orderItem){
        OrderItemDto orderItemDto = new OrderItemDto();
        orderItemDto.setId(orderItem.getId());
        orderItemDto.setQuantity(orderItem.getQuantity());
        orderItemDto.setPrice(orderItem.getPrice());
        orderItemDto.setStatus(orderItem.getStatus().name());
        orderItemDto.setCreatedAt(orderItem.getCreatedAt());
        return orderItemDto;
    }

    public ProductDto productToDto(Product product){
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setImageUrl(product.getImageUrl());
        return productDto;
    }

    //
    public UserDto userToDtoPlusAddress(User user){
        UserDto userDto = userToDto(user);
        if(user.getAddress() != null){
            AddressDto addressDto = addressToDto(user.getAddress());
            userDto.setAddress(addressDto);
        }
        return userDto;
    }

    //order to dto plus product
    public OrderItemDto orderItemToDtoPlusProduct(OrderItem orderItem){
        OrderItemDto orderItemDto = orderItemToDto(orderItem);
        if (orderItem.getProduct() != null){
            ProductDto productDto = productToDto(orderItem.getProduct());
            orderItemDto.setProduct(productDto);
        }
        return orderItemDto;
    }

    public OrderItemDto orderItemToDtoPlusProductAndUser(OrderItem orderItem){
        OrderItemDto orderItemDto = orderItemToDtoPlusProduct(orderItem);
        if (orderItem.getUser() != null){
            UserDto userDto = userToDtoPlusAddress(orderItem.getUser());
            orderItemDto.setUser(userDto);
        }
        return orderItemDto;
    }

    //user to dto with address and order item history
    public UserDto userToDtoPlusAddressAndOrderHistory(User user){
        UserDto userDto = userToDtoPlusAddress(user);
        if(user.getOrderItemList() != null&&user.getOrderItemList().isEmpty()){
            userDto.setOrderItemList(user.getOrderItemList()
                    .stream()
                    .map(this::orderItemToDtoPlusProduct)
                    .collect(Collectors.toList()));
        }
        return userDto;
    }
}
