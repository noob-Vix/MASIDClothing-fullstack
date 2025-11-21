package com.codeWithMark.MASIDClothing.service.impl;


import com.codeWithMark.MASIDClothing.dto.ProductDto;
import com.codeWithMark.MASIDClothing.dto.Response;
import com.codeWithMark.MASIDClothing.entity.Category;
import com.codeWithMark.MASIDClothing.entity.Product;
import com.codeWithMark.MASIDClothing.exception.NotFoundException;
import com.codeWithMark.MASIDClothing.mapper.EntityDtoMapper;
import com.codeWithMark.MASIDClothing.repository.CategoryRepo;
import com.codeWithMark.MASIDClothing.repository.ProductRepo;
import com.codeWithMark.MASIDClothing.service.CloudinaryService; // Update this import path to match your project structure

import com.codeWithMark.MASIDClothing.service.interf.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final EntityDtoMapper entityDtoMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    public Response createProduct(Long categoryId, MultipartFile image, String name, String description, BigDecimal price) {
        try {
            Category category = categoryRepo.findById(categoryId)
                    .orElseThrow(() -> new NotFoundException("Category not found"));

            String productImageUrl = cloudinaryService.uploadFile(image, "products");

            Product product = new Product();
            product.setCategory(category);
            product.setPrice(price);
            product.setName(name);
            product.setDescription(description);
            product.setImageUrl(productImageUrl);

            productRepo.save(product);
            return Response.builder()
                    .status(200)
                    .message("Product successfully created")
                    .build();
        } catch (IOException e) {
            log.error("Error uploading image to Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Failed to upload product image: " + e.getMessage());
        }
    }

    @Override
    public Response updateProduct(Long productId, Long categoryId, MultipartFile image, String name, String description, BigDecimal price) {
        try {
            Product product = productRepo.findById(productId)
                    .orElseThrow(() -> new NotFoundException("Product Not Found"));

            Category category = null;
            String productImageUrl = null;

            if (categoryId != null) {
                category = categoryRepo.findById(categoryId)
                        .orElseThrow(() -> new NotFoundException("Category not found"));
            }

            if (image != null && !image.isEmpty()) {
                productImageUrl = cloudinaryService.uploadFile(image, "products");
            }

            if (category != null) product.setCategory(category);
            if (name != null) product.setName(name);
            if (price != null) product.setPrice(price);
            if (description != null) product.setDescription(description);
            if (productImageUrl != null) product.setImageUrl(productImageUrl);

            productRepo.save(product);
            return Response.builder()
                    .status(200)
                    .message("Product updated successfully")
                    .build();
        } catch (IOException e) {
            log.error("Error updating image to Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Failed to update product image: " + e.getMessage());
        }
    }

    @Override
    public Response deleteProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        productRepo.delete(product);

        return Response.builder()
                .status(200)
                .message("Product deleted successfully")
                .build();
    }

    @Override
    public Response getProductById(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));
        ProductDto productDto = entityDtoMapper.productToDto(product);

        return Response.builder()
                .status(200)
                .product(productDto)
                .build();
    }

    @Override
    public Response getAllProducts() {
        List<ProductDto> productList = productRepo.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .map(entityDtoMapper::productToDto)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .productList(productList)
                .build();
    }

    @Override
    public Response getProductsByCategory(Long categoryId) {
        List<Product> products = productRepo.findByCategoryId(categoryId);
        if (products.isEmpty()) {
            throw new NotFoundException("No Products found for this category");
        }
        List<ProductDto> productDtoList = products.stream()
                .map(entityDtoMapper::productToDto)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .productList(productDtoList)
                .build();
    }

    @Override
    public Response searchProduct(String searchValue) {
        List<Product> products = productRepo.findByNameContainingOrDescriptionContaining(searchValue, searchValue);

        if (products.isEmpty()) {
            throw new NotFoundException("No Products Found");
        }
        List<ProductDto> productDtoList = products.stream()
                .map(entityDtoMapper::productToDto)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .productList(productDtoList)
                .build();
    }

}