document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소
    const authContainer = document.getElementById('auth-container');
    const todoContainer = document.getElementById('todo-container');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const prioritySelect = document.getElementById('todo-priority');

    // Supabase 설정
    const SUPABASE_URL = 'https://ttplhgycytpdbtvldlqe.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0cGxoZ3ljeXRwZGJ0dmxkbHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDQ3NTQsImV4cCI6MjA5NDc4MDc1NH0.ugY1yu1NsGrEONaa-TQesGRZPYOYIkMZgETZQsCv14s';
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let todos = [];
    let currentUser = null;

    // 1. 인증 상태 감시
    client.auth.onAuthStateChange((event, session) => {
        if (session) {
            currentUser = session.user;
            authContainer.classList.add('hidden');
            todoContainer.classList.remove('hidden');
            fetchTodos();
        } else {
            currentUser = null;
            authContainer.classList.remove('hidden');
            todoContainer.classList.add('hidden');
            todos = [];
            renderTodos();
        }
    });

    // 2. 인증 기능
    async function handleSignUp() {
        const email = emailInput.value;
        const password = passwordInput.value;
        const { error } = await client.auth.signUp({ email, password });
        if (error) alert('회원가입 실패: ' + error.message);
        else alert('회원가입 성공! 이메일을 확인하거나 로그인을 시도하세요.');
    }

    async function handleLogin() {
        const email = emailInput.value;
        const password = passwordInput.value;
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) alert('로그인 실패: ' + error.message);
    }

    async function handleLogout() {
        await client.auth.signOut();
    }

    // 3. 데이터 로드 (Read)
    async function fetchTodos() {
        if (!currentUser) return;

        const { data, error } = await client
            .from('todos')
            .select('*')
            .eq('user_id', currentUser.id) // 본인 데이터만 필터링
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching todos:', error);
            return;
        }
        todos = data;
        renderTodos();
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo) => {
            const li = document.createElement('li');
            li.className = `priority-${todo.priority}`;
            
            const span = document.createElement('span');
            span.className = `todo-text ${todo.is_completed ? 'completed' : ''}`;
            
            const priorityText = todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '보통' : '낮음';
            const priorityBadge = `<span class="priority-badge ${todo.priority}">${priorityText}</span>`;
            
            span.innerHTML = `${priorityBadge} ${todo.text}`;
            span.onclick = () => toggleTodo(todo.id, todo.is_completed);

            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = '삭제';
            delBtn.onclick = () => deleteTodo(todo.id);

            li.appendChild(span);
            li.appendChild(delBtn);
            todoList.appendChild(li);
        });
    }

    // 4. 기능 구현: 추가 (Create)
    async function addTodo() {
        if (!currentUser) return;
        
        const text = input.value.trim();
        const priority = prioritySelect.value;
        if (text !== '') {
            const { error } = await client
                .from('todos')
                .insert([{ 
                    text, 
                    priority, 
                    is_completed: false,
                    user_id: currentUser.id // 사용자 ID 저장
                }]);

            if (error) {
                console.error('Error adding todo:', error);
            } else {
                input.value = '';
                fetchTodos();
            }
        }
    }

    // 5. 기능 구현: 토글 (Update)
    async function toggleTodo(id, currentStatus) {
        const { error } = await client
            .from('todos')
            .update({ is_completed: !currentStatus })
            .eq('id', id);

        if (error) {
            console.error('Error toggling todo:', error);
        } else {
            fetchTodos();
        }
    }

    // 6. 기능 구현: 삭제 (Delete)
    async function deleteTodo(id) {
        const { error } = await client
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting todo:', error);
        } else {
            fetchTodos();
        }
    }

    // 이벤트 리스너
    loginBtn.onclick = handleLogin;
    signupBtn.onclick = handleSignUp;
    logoutBtn.onclick = handleLogout;
    addBtn.onclick = addTodo;
    input.onkeypress = (e) => {
        if (e.key === 'Enter') addTodo();
    };
});
