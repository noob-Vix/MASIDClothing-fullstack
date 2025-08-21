package com.codeWithMark.MASIDClothing.repository;

import com.codeWithMark.MASIDClothing.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Long> {
}
