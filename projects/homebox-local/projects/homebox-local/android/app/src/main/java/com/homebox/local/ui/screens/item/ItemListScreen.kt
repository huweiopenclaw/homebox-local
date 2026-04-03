package com.homebox.local.ui.screens.item

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import coil.request.ImageRequest
import java.io.File

/**
 * 物品列表页面
 * 
 * 功能：
 * - LazyColumn 显示物品列表
 * - 每个物品卡片显示：名称、位置、数量、图片缩略图
 * - 支持按分类筛选
 * - 点击进入详情页
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemListScreen(
    onItemClick: (String) -> Unit,
    onBack: () -> Unit,
    viewModel: ItemListViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    var showFilterSheet by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "物品列表",
                        fontWeight = FontWeight.SemiBold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF4F46E5),
                    titleContentColor = Color.White
                ),
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            Icons.Default.ArrowBack,
                            contentDescription = "返回",
                            tint = Color.White
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { showFilterSheet = true }) {
                        Icon(
                            Icons.Default.FilterList,
                            contentDescription = "筛选",
                            tint = Color.White
                        )
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // 搜索栏
            SearchBar(
                query = uiState.searchQuery,
                onQueryChange = { viewModel.updateSearchQuery(it) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            )

            // 分类筛选标签
            if (uiState.categories.isNotEmpty()) {
                CategoryFilterChips(
                    categories = uiState.categories,
                    selectedCategory = uiState.selectedCategory,
                    onCategorySelected = { viewModel.selectCategory(it) },
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
            }

            // 活跃筛选指示器
            if (uiState.selectedCategory != null || uiState.searchQuery.isNotBlank()) {
                ActiveFilterIndicator(
                    hasFilters = true,
                    onClear = { viewModel.clearFilters() },
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
            }

            // 物品列表
            when {
                uiState.isLoading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            color = Color(0xFF4F46E5)
                        )
                    }
                }
                uiState.items.isEmpty() -> {
                    EmptyItemsState(
                        hasFilters = uiState.selectedCategory != null || uiState.searchQuery.isNotBlank()
                    )
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(
                            items = uiState.items,
                            key = { it.item.id }
                        ) { itemWithLocation ->
                            ItemCard(
                                itemWithLocation = itemWithLocation,
                                onClick = { onItemClick(itemWithLocation.item.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * 搜索栏
 */
@Composable
private fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier,
        placeholder = {
            Text(
                text = "搜索物品...",
                color = Color(0xFF94A3B8)
            )
        },
        leadingIcon = {
            Icon(
                Icons.Default.Search,
                contentDescription = "搜索",
                tint = Color(0xFF64748B)
            )
        },
        trailingIcon = {
            if (query.isNotEmpty()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(
                        Icons.Default.Clear,
                        contentDescription = "清除",
                        tint = Color(0xFF64748B)
                    )
                }
            }
        },
        singleLine = true,
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Color(0xFF4F46E5),
            unfocusedBorderColor = Color(0xFFE2E8F0),
            focusedContainerColor = Color.White,
            unfocusedContainerColor = Color(0xFFF8FAFC)
        )
    )
}

/**
 * 分类筛选标签行
 */
@Composable
private fun CategoryFilterChips(
    categories: List<String>,
    selectedCategory: String?,
    onCategorySelected: (String?) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // 全部选项
        item {
            FilterChip(
                selected = selectedCategory == null,
                onClick = { onCategorySelected(null) },
                label = { Text("全部") },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Color(0xFF4F46E5),
                    selectedLabelColor = Color.White
                )
            )
        }
        // 分类选项
        items(categories) { category ->
            FilterChip(
                selected = selectedCategory == category,
                onClick = { onCategorySelected(category) },
                label = { Text(category) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Color(0xFF4F46E5),
                    selectedLabelColor = Color.White
                )
            )
        }
    }
}

/**
 * 活跃筛选指示器
 */
@Composable
private fun ActiveFilterIndicator(
    hasFilters: Boolean,
    onClear: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (hasFilters) {
        Row(
            modifier = modifier,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Default.FilterAlt,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
                tint = Color(0xFF64748B)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "筛选已启用",
                fontSize = 13.sp,
                color = Color(0xFF64748B)
            )
            Spacer(modifier = Modifier.width(8.dp))
            TextButton(
                onClick = onClear,
                contentPadding = PaddingValues(0.dp)
            ) {
                Text(
                    text = "清除筛选",
                    fontSize = 13.sp,
                    color = Color(0xFF4F46E5)
                )
            }
        }
    }
}

/**
 * 物品卡片
 */
@Composable
private fun ItemCard(
    itemWithLocation: ItemWithLocation,
    onClick: () -> Unit
) {
    val item = itemWithLocation.item
    val box = itemWithLocation.box
    val location = itemWithLocation.location

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp)
        ) {
            // 图片缩略图
            ItemThumbnail(
                photoPath = item.photoPath,
                modifier = Modifier.size(72.dp)
            )

            Spacer(modifier = Modifier.width(12.dp))

            // 物品信息
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // 名称
                Text(
                    text = item.name,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF0F172A),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                // 分类标签
                if (!item.category.isNullOrBlank()) {
                    SuggestionChip(
                        onClick = { },
                        label = { 
                            Text(
                                text = item.category,
                                fontSize = 12.sp
                            )
                        },
                        modifier = Modifier.height(26.dp),
                        colors = SuggestionChipDefaults.suggestionChipColors(
                            containerColor = Color(0xFFF1F5F9),
                            labelColor = Color(0xFF475569)
                        ),
                        border = null
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                // 位置信息
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Place,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = Color(0xFF64748B)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = buildLocationText(box, location),
                        fontSize = 13.sp,
                        color = Color(0xFF64748B),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            // 数量
            Column(
                horizontalAlignment = Alignment.End
            ) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFF4F46E5).copy(alpha = 0.1f)
                ) {
                    Text(
                        text = "×${item.quantity}",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFF4F46E5)
                    )
                }
                
                Spacer(modifier = Modifier.height(8.dp))

                Icon(
                    Icons.Default.ChevronRight,
                    contentDescription = "查看详情",
                    tint = Color(0xFFCBD5E1)
                )
            }
        }
    }
}

/**
 * 物品缩略图
 */
@Composable
private fun ItemThumbnail(
    photoPath: String?,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(Color(0xFFF1F5F9)),
        contentAlignment = Alignment.Center
    ) {
        if (photoPath.isNullOrBlank()) {
            // 无图片时显示占位图标
            Icon(
                Icons.Outlined.Inventory2,
                contentDescription = "物品",
                modifier = Modifier.size(32.dp),
                tint = Color(0xFF94A3B8)
            )
        } else {
            // 加载图片
            AsyncImage(
                model = ImageRequest.Builder(context)
                    .data(File(photoPath))
                    .crossfade(true)
                    .build(),
                contentDescription = "物品图片",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }
    }
}

/**
 * 构建位置文本
 */
private fun buildLocationText(box: BoxEntity?, location: LocationEntity?): String {
    if (box == null) return "未分配位置"
    
    val locationParts = mutableListOf<String>()
    location?.let {
        locationParts.add(it.room)
        locationParts.add(it.furniture)
    }
    locationParts.add(box.name)
    
    return locationParts.joinToString(" > ")
}

/**
 * 空状态
 */
@Composable
private fun EmptyItemsState(
    hasFilters: Boolean
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            Icons.Outlined.Inventory2,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = Color(0xFFCBD5E1)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = if (hasFilters) "没有找到匹配的物品" else "暂无物品",
            fontSize = 16.sp,
            color = Color(0xFF64748B)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = if (hasFilters) "尝试更改筛选条件" else "添加箱子后可以查看物品",
            fontSize = 14.sp,
            color = Color(0xFF94A3B8)
        )
    }
}
