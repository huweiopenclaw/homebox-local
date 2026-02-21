package com.homebox.local.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel

/**
 * 首页
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToBoxes: () -> Unit,
    onNavigateToSearch: () -> Unit,
    onNavigateToChat: () -> Unit,
    onNavigateToSettings: () -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        text = "HomeBox",
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF4F46E5),
                    titleContentColor = Color.White
                ),
                actions = {
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(
                            Icons.Default.Settings,
                            contentDescription = "设置",
                            tint = Color.White
                        )
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNavigateToBoxes,
                containerColor = Color(0xFF4F46E5),
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "添加箱子")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            // 搜索栏
            SearchBar(
                modifier = Modifier.fillMaxWidth(),
                onClick = onNavigateToSearch
            )
            
            Spacer(modifier = Modifier.height(20.dp))
            
            // 快捷操作
            QuickActions(
                onAddBox = onNavigateToBoxes,
                onChat = onNavigateToChat
            )
            
            Spacer(modifier = Modifier.height(20.dp))
            
            // 统计卡片
            StatsCard(
                boxCount = uiState.boxCount,
                itemCount = uiState.itemCount,
                locationCount = uiState.locationCount
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // 最近记录
            Text(
                text = "最近记录",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF0F172A)
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            if (uiState.recentBoxes.isEmpty()) {
                EmptyState(onAddBox = onNavigateToBoxes)
            } else {
                LazyColumn {
                    items(uiState.recentBoxes) { box ->
                        BoxCard(
                            box = box,
                            onClick = { /* TODO */ }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun SearchBar(
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .height(50.dp)
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        color = Color.White,
        shadowElevation = 2.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Default.Search,
                contentDescription = "搜索",
                tint = Color(0xFF94A3B8)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = "搜索物品或箱子...",
                color = Color(0xFF94A3B8),
                fontSize = 15.sp
            )
        }
    }
}

@Composable
private fun QuickActions(
    onAddBox: () -> Unit,
    onChat: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        QuickActionButton(
            modifier = Modifier.weight(1f),
            icon = Icons.Default.Inventory2,
            text = "记录箱子",
            onClick = onAddBox
        )
        QuickActionButton(
            modifier = Modifier.weight(1f),
            icon = Icons.Default.Chat,
            text = "AI 查询",
            onClick = onChat
        )
    }
}

@Composable
private fun QuickActionButton(
    modifier: Modifier = Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .height(90.dp)
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        color = Color.White,
        shadowElevation = 2.dp
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                icon,
                contentDescription = text,
                modifier = Modifier.size(32.dp),
                tint = Color(0xFF4F46E5)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = text,
                fontSize = 14.sp,
                color = Color(0xFF475569)
            )
        }
    }
}

@Composable
private fun StatsCard(
    boxCount: Int,
    itemCount: Int,
    locationCount: Int
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF4F46E5),
                        Color(0xFF7C3AED)
                    )
                )
            )
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            StatItem(count = boxCount, label = "箱子")
            VerticalDivider()
            StatItem(count = itemCount, label = "物品")
            VerticalDivider()
            StatItem(count = locationCount, label = "位置")
        }
    }
}

@Composable
private fun StatItem(
    count: Int,
    label: String
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = count.toString(),
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
        Text(
            text = label,
            fontSize = 12.sp,
            color = Color.White.copy(alpha = 0.8f)
        )
    }
}

@Composable
private fun VerticalDivider() {
    Box(
        modifier = Modifier
            .width(1.dp)
            .height(40.dp)
            .background(Color.White.copy(alpha = 0.3f))
    )
}

@Composable
private fun EmptyState(
    onAddBox: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "📦",
            fontSize = 48.sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "还没有记录任何箱子",
            color = Color(0xFF64748B),
            fontSize = 15.sp
        )
        Spacer(modifier = Modifier.height(20.dp))
        Button(
            onClick = onAddBox,
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF4F46E5)
            )
        ) {
            Text("添加第一个箱子")
        }
    }
}

@Composable
private fun BoxCard(
    box: Box,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        color = Color.White,
        shadowElevation = 1.dp
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // 照片占位
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFF1F5F9)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = if (box.photoPath != null) "📷" else "📦",
                    fontSize = 24.sp
                )
            }
            
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 16.dp)
            ) {
                Text(
                    text = box.name,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF0F172A)
                )
                Text(
                    text = box.location ?: "未设置位置",
                    fontSize = 13.sp,
                    color = Color(0xFF64748B)
                )
            }
            
            Icon(
                Icons.Default.ChevronRight,
                contentDescription = null,
                tint = Color(0xFFCBD5E1)
            )
        }
    }
}

// 简化的数据类
data class Box(
    val id: String,
    val name: String,
    val location: String? = null,
    val photoPath: String? = null
)

data class HomeUiState(
    val boxCount: Int = 0,
    val itemCount: Int = 0,
    val locationCount: Int = 0,
    val recentBoxes: List<Box> = emptyList(),
    val isLoading: Boolean = false
)
