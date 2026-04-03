package com.homebox.local.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.homebox.local.ui.screens.home.HomeScreen
import com.homebox.local.ui.screens.box.BoxListScreen
import com.homebox.local.ui.screens.box.BoxDetailScreen
import com.homebox.local.ui.screens.box.AddBoxScreen
import com.homebox.local.ui.screens.item.ItemListScreen
import com.homebox.local.ui.screens.item.ItemDetailScreen
import com.homebox.local.ui.screens.search.SearchScreen
import com.homebox.local.ui.screens.chat.ChatScreen
import com.homebox.local.ui.screens.settings.SettingsScreen

/**
 * 导航路由
 */
object Routes {
    const val HOME = "home"
    const val BOX_LIST = "box_list"
    const val BOX_DETAIL = "box_detail/{boxId}"
    const val ADD_BOX = "add_box"
    const val ITEM_LIST = "item_list"
    const val ITEM_DETAIL = "item_detail/{itemId}"
    const val SEARCH = "search"
    const val CHAT = "chat"
    const val SETTINGS = "settings"
    
    fun boxDetail(boxId: String) = "box_detail/$boxId"
    fun itemDetail(itemId: String) = "item_detail/$itemId"
}

/**
 * 主导航控制器
 */
@Composable
fun HomeBoxNavHost(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Routes.HOME
    ) {
        composable(Routes.HOME) {
            HomeScreen(
                onNavigateToBoxes = { navController.navigate(Routes.BOX_LIST) },
                onNavigateToItems = { navController.navigate(Routes.ITEM_LIST) },
                onNavigateToSearch = { navController.navigate(Routes.SEARCH) },
                onNavigateToChat = { navController.navigate(Routes.CHAT) },
                onNavigateToSettings = { navController.navigate(Routes.SETTINGS) }
            )
        }
        
        composable(Routes.BOX_LIST) {
            BoxListScreen(
                onBoxClick = { boxId -> navController.navigate(Routes.boxDetail(boxId)) },
                onAddBox = { navController.navigate(Routes.ADD_BOX) },
                onBack = { navController.popBackStack() }
            )
        }
        
        composable(Routes.BOX_DETAIL) { backStackEntry ->
            val boxId = backStackEntry.arguments?.getString("boxId") ?: ""
            BoxDetailScreen(
                boxId = boxId,
                onBack = { navController.popBackStack() },
                onEdit = { /* TODO */ }
            )
        }
        
        composable(Routes.ADD_BOX) {
            AddBoxScreen(
                onSaved = { navController.popBackStack() },
                onCancelled = { navController.popBackStack() }
            )
        }
        
        composable(Routes.ITEM_LIST) {
            ItemListScreen(
                onItemClick = { itemId -> navController.navigate(Routes.itemDetail(itemId)) },
                onBack = { navController.popBackStack() }
            )
        }
        
        composable(Routes.ITEM_DETAIL) { backStackEntry ->
            val itemId = backStackEntry.arguments?.getString("itemId") ?: ""
            ItemDetailScreen(
                itemId = itemId,
                onBack = { navController.popBackStack() },
                onEdit = { /* TODO */ }
            )
        }
        
        composable(Routes.SEARCH) {
            SearchScreen(
                onBoxClick = { boxId -> navController.navigate(Routes.boxDetail(boxId)) },
                onBack = { navController.popBackStack() }
            )
        }
        
        composable(Routes.CHAT) {
            ChatScreen(
                onBack = { navController.popBackStack() }
            )
        }
        
        composable(Routes.SETTINGS) {
            SettingsScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}
