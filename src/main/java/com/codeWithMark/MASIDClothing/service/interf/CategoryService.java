package com.codeWithMark.MASIDClothing.service.interf;

import com.codeWithMark.MASIDClothing.dto.CategoryDto;
import com.codeWithMark.MASIDClothing.dto.Response;

public interface CategoryService {

    Response createCategory(CategoryDto categoryRequest);

    Response updateCategory(Long categoryId, CategoryDto categoryRequest);

    Response getAllCategories();

    Response getCategoryById(Long categoryId);

    Response deleteCategory(Long categoryId);
}
