<template>
  <!-- ============================================================
       页面模板 B · 列表 CRUD（桌面 / H5 v2.0 双形态）
       形态：桌面 = 工具条 + el-table + 分页
             H5    = 玻璃搜索卡 + BigKpi + 记录卡片列表 + FAB 新建
       数据：useMock（src/mock.js）演示；接真实 API 见 AI-GUIDE.md
       ============================================================ -->

  <!-- ▼▼▼ H5 视觉规范 v2.0 形态（≤768px）▼▼▼ -->
  <div v-if="isH5" class="h5-page h5-crud">
    <!-- 玻璃搜索卡：关键词 + 分类/状态 chips -->
    <div class="h5-glass h5-search-card">
      <div class="h5-search">
        <SvgIcon name="search" size="sm" :accent="1" />
        <input v-model="query.keyword" class="h5-search-input" placeholder="搜索编号 / 名称" />
      </div>
      <div class="h5-chips">
        <button v-for="c in catChips" :key="'c' + c" class="h5-chip"
          :class="{ on: query.category === c || (!c && !query.category) }" @click="pickCat(c)">{{ c || '全部分类' }}</button>
      </div>
      <div class="h5-chips">
        <button v-for="s in stChips" :key="'s' + s" class="h5-chip"
          :class="{ on: query.status === s || (!s && !query.status) }" @click="pickSt(s)">{{ s || '全部状态' }}</button>
      </div>
    </div>

    <!-- KPI 行：总记录 / 进行中 / 金额合计（真实数据聚合） -->
    <div class="h5-kpis h5-kpis-3">
      <BigKpi title="全部记录" :value="filtered.length" unit="条" :show-bar="false" />
      <BigKpi title="进行中" :value="doingCount" unit="条" :show-bar="false" />
      <BigKpi title="金额合计" :value="amountSumText" sub="人民币" :show-bar="false" />
    </div>

    <!-- 记录卡片列表 -->
    <div class="h5-list">
      <article v-for="r in pageRows" :key="r.id" class="h5-glass h5-row">
        <div class="h5-row-top">
          <span class="h5-code">{{ r.code }}</span>
          <span class="h5-name">{{ r.name }}</span>
          <span class="h5-st" :style="{ color: stColor(r.status), borderColor: stColor(r.status) }">{{ r.status }}</span>
        </div>
        <div class="h5-row-meta">{{ r.category }} · {{ r.owner }} · ¥ {{ r.amount.toLocaleString() }}</div>
        <div class="h5-row-bot">
          <span class="h5-time">{{ r.createdAt }}</span>
          <span class="h5-ops">
            <button class="h5-op" aria-label="编辑" @click="openDialog(r)"><SvgIcon name="edit" size="sm" :accent="2" /></button>
            <button class="h5-op" aria-label="删除" @click="onDelete(r)"><SvgIcon name="trash" size="sm" :accent="3" /></button>
          </span>
        </div>
      </article>
      <div v-if="!pageRows.length" class="h5-glass h5-empty">无匹配记录 🎉</div>
    </div>

    <!-- 简易分页 -->
    <div class="h5-pager">
      <button class="h5-page-btn" :disabled="page <= 1" @click="page--">上一页</button>
      <span class="h5-page-info">{{ page }} / {{ Math.max(1, Math.ceil(filtered.length / pageSize)) }} 页 · 共 {{ filtered.length }} 条</span>
      <button class="h5-page-btn" :disabled="page >= Math.ceil(filtered.length / pageSize)" @click="page++">下一页</button>
    </div>

    <!-- FAB 新建 -->
    <button class="h5-fab" aria-label="新建" @click="openDialog()">
      <SvgIcon name="plus" size="lg" color="#fff" />
    </button>
    <div class="h5-spacer" />
  </div>

  <!-- ▼▼▼ 桌面形态（>768px，v1.1.0 保持不动）▼▼▼ -->
  <div v-else class="crud">
    <PanelCard title="数据管理（CRUD 演示模板）" icon="Coin">
      <template #extra>
        <el-button type="primary" :icon="Plus" @click="openDialog()">新 建</el-button>
      </template>

      <!-- 工具条 -->
      <div class="toolbar">
        <el-input v-model="query.keyword" placeholder="搜索编号/名称" clearable style="width: 220px"
          :prefix-icon="Search" @keyup.enter="page = 1" />
        <el-select v-model="query.category" placeholder="全部分类" clearable style="width: 130px">
          <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
        <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 130px">
          <el-option v-for="s in statuses" :key="s" :label="s" :value="s" />
        </el-select>
        <el-button :icon="Refresh" @click="page = 1">查 询</el-button>
        <span class="toolbar-tip muted">共 {{ filtered.length }} 条（演示数据）</span>
      </div>

      <!-- 表格 -->
      <el-table :data="pageRows" stripe>
        <el-table-column prop="code" label="编号" width="110" />
        <el-table-column prop="name" label="名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="90" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" effect="dark" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="110" />
        <el-table-column prop="amount" label="金额(元)" width="120" align="right">
          <template #default="{ row }">{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDialog(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pager">
        <el-pagination background layout="total, prev, pager, next, sizes" :total="filtered.length"
          v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]" />
      </div>
    </PanelCard>
  </div>

  <!-- 新增/编辑弹窗（桌面/H5 共用同一表单逻辑） -->
  <el-dialog v-model="dlg.visible" :title="dlg.isEdit ? '编辑记录' : '新建记录'" :width="dlgW" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="记录名称" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="选择分类" style="width: 100%">
          <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio-button v-for="s in statuses" :key="s" :value="s">{{ s }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="form.owner" placeholder="负责人" />
      </el-form-item>
      <el-form-item label="金额(元)">
        <el-input-number v-model="form.amount" :min="0" :step="100" style="width: 100%" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dlg.visible = false">取消</el-button>
      <el-button type="primary" :loading="dlg.saving" @click="onSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PanelCard from '@/components/PanelCard.vue'
import BigKpi from '@/components/BigKpi.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { USE_MOCK, mockRows, statusType } from '@/mock'
import { useH5 } from '@/useH5'
// 真实后端接入时：import { crudApi } from '@/api'，把 load/save/del 换成 API 调用

const { isH5 } = useH5()
const dlgW = computed(() => (isH5.value ? '92%' : '520px'))

const categories = ['采购', '销售', '库存', '财务', '人事']
const statuses = ['进行中', '已完成', '已暂停']
const catChips = ['', ...categories]
const stChips = ['', ...statuses]

/* ---- 数据层（mock）：演示数据存内存，真实系统改为 API + 服务端分页 ---- */
const allRows = ref(USE_MOCK ? mockRows(35) : [])
const page = ref(1)
const pageSize = ref(10)

const query = reactive({ keyword: '', category: '', status: '' })
const filtered = computed(() => allRows.value.filter((r) => {
  const kw = (query.keyword || '').toLowerCase()
  const hitKw = !kw || r.name.toLowerCase().includes(kw) || r.code.toLowerCase().includes(kw)
  const hitCat = !query.category || r.category === query.category
  const hitSt = !query.status || r.status === query.status
  return hitKw && hitCat && hitSt
}))
const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

/* ---- H5 KPI（真实数据聚合，非静态桩）---- */
const doingCount = computed(() => filtered.value.filter((r) => r.status === '进行中').length)
const amountSumText = computed(() => {
  const s = filtered.value.reduce((a, r) => a + (r.amount || 0), 0)
  return s >= 10000 ? (s / 10000).toFixed(1) : Math.round(s).toLocaleString()
})

/* ---- H5 chips 交互 ---- */
function pickCat(c) { query.category = c; page.value = 1 }
function pickSt(s) { query.status = s; page.value = 1 }

/* ---- 状态色（H5 自绘胶囊）---- */
const ST_COLOR = { 进行中: 'var(--v2-warning, #FF7A45)', 已完成: 'var(--v2-success, #2BD89B)', 已暂停: 'var(--v2-text-3)' }
function stColor(s) { return ST_COLOR[s] || 'var(--v2-text-3)' }

/* ---- 弹窗表单 ---- */
const formRef = ref(null)
const dlg = reactive({ visible: false, isEdit: false, saving: false })
const emptyForm = () => ({ id: 0, name: '', category: '销售', status: '进行中', owner: '', amount: 0, remark: '' })
const form = ref(emptyForm())
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function openDialog(row) {
  dlg.isEdit = !!row
  form.value = row ? { ...row } : emptyForm()
  dlg.visible = true
}

function nextCode() {
  return `S-${String(1000 + allRows.value.length + 1).slice(-4)}`
}

async function onSave() {
  await formRef.value.validate()
  dlg.saving = true
  try {
    if (USE_MOCK) {
      if (dlg.isEdit) {
        const i = allRows.value.findIndex((r) => r.id === form.value.id)
        if (i >= 0) allRows.value[i] = { ...form.value }
      } else {
        const now = new Date()
        allRows.value.unshift({
          ...form.value,
          id: Date.now(),
          code: nextCode(),
          createdAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        })
      }
    } else {
      // dlg.isEdit ? await crudApi.update(form.value) : await crudApi.create(form.value)
    }
    ElMessage.success(dlg.isEdit ? '已更新' : '已创建')
    dlg.visible = false
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  } finally {
    dlg.saving = false
  }
}

async function onDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除「${row.name}」？删除后不可恢复。`, '删除确认', { type: 'warning' })
  } catch (e) {
    return
  }
  if (USE_MOCK) {
    allRows.value = allRows.value.filter((r) => r.id !== row.id)
  } else {
    // await crudApi.remove(row.id)
  }
  ElMessage.success('已删除')
}
</script>

<style scoped>
.toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.toolbar-tip { margin-left: auto; }
.pager { display: flex; justify-content: flex-end; margin-top: 14px; }

/* ============================================================
   H5 视觉规范 v2.0 形态（≤768px，useH5 控制渲染分支）
   ============================================================ */
.h5-page {
  display: flex; flex-direction: column; gap: 14px;
  padding-bottom: 8px;
  /* H5 皮肤背景（随 data-h5-skin 切换，与桌面主题解耦） */
  background: var(--v2-bg-deep, linear-gradient(135deg, #0B1F3A 0%, #0A1124 100%));
  background-attachment: fixed;
}
.h5-glass {
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-md, 12px);
  box-shadow: var(--v2-shadow-glass, 0 8px 32px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: var(--v2-text-1);
}

/* ---- 搜索卡 ---- */
.h5-search-card { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.h5-search {
  display: flex; align-items: center; gap: 8px;
  padding: 0 12px; height: 40px;
  background: color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 55%, transparent);
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-pill, 999px);
}
.h5-search-input {
  flex: 1; min-width: 0;
  background: transparent; border: none; outline: none;
  color: var(--v2-text-1);
  font-size: 14px;
}
.h5-search-input::placeholder { color: var(--v2-text-3); }
.h5-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
.h5-chips::-webkit-scrollbar { display: none; }
.h5-chip {
  flex-shrink: 0;
  padding: 5px 14px;
  border-radius: var(--v2-r-pill, 999px);
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  background: transparent;
  color: var(--v2-text-2);
  font-size: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.h5-chip.on {
  background: color-mix(in srgb, var(--v2-primary, #4F8AFF) 22%, transparent);
  border-color: color-mix(in srgb, var(--v2-primary, #4F8AFF) 55%, transparent);
  color: var(--v2-primary, #4F8AFF);
  font-weight: 600;
}

/* ---- KPI 行 ---- */
.h5-kpis { display: grid; gap: 12px; }
.h5-kpis-3 { grid-template-columns: repeat(3, 1fr); }
.h5-kpis-3 .bkp { padding: 12px 10px; }
.h5-kpis-3 :deep(.bkp-num) { font-size: 19px; }

/* ---- 记录卡片 ---- */
.h5-list { display: flex; flex-direction: column; gap: 10px; }
.h5-row { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.h5-row-top { display: flex; align-items: center; gap: 8px; min-width: 0; }
.h5-code {
  flex-shrink: 0;
  padding: 3px 8px;
  border-radius: var(--v2-r-sm, 8px);
  background: color-mix(in srgb, var(--v2-accent-1, #2BD4D4) 18%, transparent);
  color: var(--v2-accent-1, #2BD4D4);
  font-size: 11px; font-weight: 700;
}
.h5-name { flex: 1; min-width: 0; font-size: 15px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.h5-st {
  flex-shrink: 0;
  font-size: 11px; font-weight: 600;
  border: 1px solid; border-radius: var(--v2-r-pill, 999px);
  padding: 2px 8px;
}
.h5-row-meta { font-size: 12px; color: var(--v2-text-3); }
.h5-row-bot { display: flex; align-items: center; justify-content: space-between; }
.h5-time { font-size: 11px; color: var(--v2-text-3); }
.h5-ops { display: flex; gap: 6px; }
.h5-op {
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 60%, transparent);
  border: none; border-radius: var(--v2-r-sm, 8px);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.h5-empty { padding: 24px; text-align: center; font-size: 13px; color: var(--v2-text-3); }

/* ---- 简易分页 ---- */
.h5-pager { display: flex; align-items: center; justify-content: center; gap: 12px; }
.h5-page-btn {
  padding: 6px 14px;
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-pill, 999px);
  color: var(--v2-text-1);
  font-size: 12px;
  cursor: pointer;
}
.h5-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.h5-page-info { font-size: 12px; color: var(--v2-text-2); }

/* ---- FAB ---- */
.h5-fab {
  position: fixed; right: 18px;
  bottom: calc(76px + env(safe-area-inset-bottom, 0px));
  z-index: 90;
  width: 52px; height: 52px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--v2-primary, #4F8AFF), var(--v2-accent-2, #B968F0));
  box-shadow: 0 8px 24px color-mix(in srgb, var(--v2-primary, #4F8AFF) 45%, transparent);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s ease;
}
.h5-fab:active { transform: scale(0.92); }
.h5-spacer { height: 60px; }

/* 移动端 el-dialog 近全屏 */
@media (max-width: 768px) {
  :deep(.el-dialog) { margin: 8vh auto; border-radius: 16px; }
}
</style>
