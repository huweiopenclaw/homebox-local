package com.homebox.local.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.homebox.local.data.model.Item
import com.homebox.local.ui.search.SearchScreen
import com.homebox.local.ui.search.SearchViewModel
import com.homebox.local.ui.search.SearchViewModelFactory

/**
 * 导航路由定义
 */
object SearchRoutes {
    const val SEARCH = "search"
    const val SEARCH_RESULT = "search_result"
}

/**
 * 搜索功能导航图
 */
@Composable
fun SearchNavigationGraph(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController(),
    onBackClick: () -> Unit = {},
    onItemSelected: (Item) -> Unit = {}
) {
    NavHost(
        navController = navController,
        startDestination = SearchRoutes.SEARCH,
        modifier = modifier
    ) {
        composable(SearchRoutes.SEARCH) {
            val viewModel: SearchViewModel = viewModel(
                factory = SearchViewModelFactory(
                    androidx.compose.ui.platform.LocalContext.current.applicationContext 
                        as android.app.Application
                )
            )
            
            SearchScreen(
                viewModel = viewModel,
                onItemClick = { item ->
                    onItemSelected(item)
                },
                onBackClick = onBackClick
            )
        }
    }
}

/**
 * 搜索功能使用示例
 * 
 * 在你的主应用导航中添加搜索入口：
 * 
 * ```kotlin
 * // 在 MainNavigationGraph 中
 * composable("search") {
 *     val viewModel: SearchViewModel = viewModel(
 *         factory = SearchViewModelFactory(
 *             LocalContext.current.applicationContext as Application
 *         )
 *     )
 *     
 *     SearchScreen(
 *         viewModel = viewModel,
 *         onItemClick = { item ->
 *             // 导航到物品详情页
 *             navController.navigate("item_detail/${item.id}")
 *         },
 *         onBackClick = {
 *             navController.popBackStack()
 *         }
 *     )
 * }
 * ```
 * 
 * 或者在 MainActivity 中使用：
 * 
 * ```kotlin
 * class MainActivity : ComponentActivity() {
 *     override fun onCreate(savedInstanceState: Bundle?) {
 *         super.onCreate(savedInstanceState)
 *         setContent {
 *             HomeBoxLocalTheme {
 *                 val navController = rememberNavController()
 *                 
 *                 NavHost(
 *                     navController = navController,
 *                     startDestination = "home"
 *                 ) {
 *                     composable("home") {
 *                         HomeScreen(
 *                             onSearchClick = {
 *                                 navController.navigate("search")
 *                             }
 *                         )
 *                     }
 *                     
 *                     composable("search") {
 *                         SearchNavigationGraph(
 *                             onBackClick = {
 *                                 navController.popBackStack()
 *                             },
 *                             onItemSelected = { item ->
 *                                 navController.navigate("item/${item.id}")
 *                             }
 *                         )
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 * ```
 */
